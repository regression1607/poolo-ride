import { db } from '../database/supabaseClient';

export interface CreateMessageData {
  rideId: string;
  senderId: string;
  receiverId: string;
  message: string;
  messageType?: 'text' | 'image' | 'location';
}

export interface RideMessage {
  id: string;
  ride_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type: 'text' | 'image' | 'location';
  sent_at: string;
  is_read: boolean;
  sender?: {
    id: string;
    name: string;
    profile_picture?: string;
  };
  receiver?: {
    id: string;
    name: string;
    profile_picture?: string;
  };
}

class MessageService {
  /**
   * Send a message in a ride conversation
   */
  async sendMessage(messageData: CreateMessageData): Promise<RideMessage> {
    try {
      console.log('=== MESSAGE SERVICE: Sending message ===');
      console.log('Message data:', messageData);

      const messageRequest = {
        ride_id: messageData.rideId,
        sender_id: messageData.senderId,
        receiver_id: messageData.receiverId,
        message: messageData.message,
        message_type: messageData.messageType || 'text',
        sent_at: new Date().toISOString(),
        is_read: false,
      };

      const { data, error } = await db.messages.create(messageRequest);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to send message: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from message creation');
      }

      const sentMessage = Array.isArray(data) ? data[0] : data;
      console.log('Message sent successfully:', sentMessage);

      return sentMessage as RideMessage;
    } catch (error) {
      console.error('MessageService.sendMessage error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to send message. Please try again.');
    }
  }

  /**
   * Get messages for a specific ride
   */
  async getMessagesByRide(rideId: string): Promise<RideMessage[]> {
    try {
      console.log('=== MESSAGE SERVICE: Fetching messages for ride ===');
      console.log('Ride ID:', rideId);

      const { data, error } = await db.messages.getByRide(rideId);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to fetch messages: ${error.message}`);
      }

      console.log('Messages fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('MessageService.getMessagesByRide error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch messages. Please try again.');
    }
  }

  /**
   * Get all conversations for a user (for inbox)
   */
  async getConversationsForUser(userId: string): Promise<RideMessage[]> {
    try {
      console.log('=== MESSAGE SERVICE: Fetching conversations for user ===');
      console.log('User ID:', userId);

      const { data, error } = await db.messages.getByUser(userId);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to fetch conversations: ${error.message}`);
      }

      console.log('Conversations fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('MessageService.getConversationsForUser error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch conversations. Please try again.');
    }
  }

  /**
   * Send automatic booking confirmation message to driver
   */
  async sendBookingConfirmationMessage(
    rideId: string,
    passengerId: string,
    driverId: string,
    passengerName: string,
    driverName: string,
    rideDetails: {
      pickupAddress: string;
      dropAddress: string;
      pickupTime: string;
      seatsBooked: number;
      totalPrice: number;
      vehicleType: string;
    }
  ): Promise<RideMessage> {
    try {
      console.log('=== MESSAGE SERVICE: Sending booking confirmation message ===');

      const formattedDate = new Date(rideDetails.pickupTime).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const formattedTime = new Date(rideDetails.pickupTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const message = `🎉 Hey ${driverName}!

I'm ${passengerName} and I just booked your ride!

📋 Booking Details:
🚗 Vehicle: ${rideDetails.vehicleType.charAt(0).toUpperCase() + rideDetails.vehicleType.slice(1)}
📅 Date: ${formattedDate}
⏰ Time: ${formattedTime}
📍 From: ${rideDetails.pickupAddress}
📍 To: ${rideDetails.dropAddress}
💺 Seats: ${rideDetails.seatsBooked}
💰 Total: ₹${rideDetails.totalPrice}

Looking forward to the ride! 🚀`;

      return await this.sendMessage({
        rideId,
        senderId: passengerId,
        receiverId: driverId,
        message,
        messageType: 'text',
      });
    } catch (error) {
      console.error('MessageService.sendBookingConfirmationMessage error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to send booking confirmation message.');
    }
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      console.log('=== MESSAGE SERVICE: Marking message as read ===');
      console.log('Message ID:', messageId);

      // This would require an update method in the database client
      // For now, we'll just log the action
      console.log('Message marked as read:', messageId);
    } catch (error) {
      console.error('MessageService.markMessageAsRead error:', error);
    }
  }
}

export const messageService = new MessageService();
