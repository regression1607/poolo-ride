import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../database/supabaseClient';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class ProfilePictureService {
  /**
   * Request camera and media library permissions
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      return cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * Pick image from camera
   */
  static async pickFromCamera(): Promise<ImagePicker.ImagePickerResult> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Camera permission is required');
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profile pictures
      quality: 0.8,
      base64: false,
    });

    return result;
  }

  /**
   * Pick image from gallery
   */
  static async pickFromGallery(): Promise<ImagePicker.ImagePickerResult> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Media library permission is required');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profile pictures
      quality: 0.8,
      base64: false,
    });

    return result;
  }

  /**
   * Upload image to Supabase storage
   */
  static async uploadProfilePicture(
    userId: string, 
    imageUri: string
  ): Promise<ImageUploadResult> {
    try {
      // Read the image file
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        return { success: false, error: 'Image file not found' };
      }

      // Generate unique filename
      const fileExtension = imageUri.split('.').pop() || 'jpg';
      const fileName = `profile-${userId}-${Date.now()}.${fileExtension}`;

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to blob
      const response = await fetch(`data:image/${fileExtension};base64,${base64}`);
      const blob = await response.blob();

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: `image/${fileExtension}`,
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      return { 
        success: true, 
        url: urlData.publicUrl 
      };

    } catch (error: any) {
      console.error('Profile picture upload error:', error);
      return { 
        success: false, 
        error: error.message || 'Upload failed' 
      };
    }
  }

  /**
   * Update user profile picture URL in database
   */
  static async updateUserProfilePicture(
    userId: string, 
    profilePictureUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ profile_picture: profilePictureUrl })
        .eq('id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Failed to update profile picture' 
      };
    }
  }

  /**
   * Delete old profile picture from storage
   */
  static async deleteProfilePicture(imageUrl: string): Promise<void> {
    try {
      // Extract filename from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      if (fileName && fileName.startsWith('profile-')) {
        await supabase.storage
          .from('profile-pictures')
          .remove([fileName]);
      }
    } catch (error) {
      console.error('Error deleting old profile picture:', error);
      // Don't throw error as this is cleanup
    }
  }

  /**
   * Complete profile picture update flow
   */
  static async updateProfilePictureComplete(
    userId: string,
    imageUri: string,
    oldImageUrl?: string
  ): Promise<ImageUploadResult> {
    try {
      // Upload new image
      const uploadResult = await this.uploadProfilePicture(userId, imageUri);
      
      if (!uploadResult.success || !uploadResult.url) {
        return uploadResult;
      }

      // Update database
      const updateResult = await this.updateUserProfilePicture(userId, uploadResult.url);
      
      if (!updateResult.success) {
        return { success: false, error: updateResult.error };
      }

      // Delete old image if exists
      if (oldImageUrl) {
        await this.deleteProfilePicture(oldImageUrl);
      }

      return uploadResult;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update profile picture'
      };
    }
  }
}
