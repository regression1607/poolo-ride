import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EnhancedProfileScreen } from '../screens/profile/EnhancedProfileScreen';
import { VehicleManagementScreen } from '../screens/profile/VehicleManagementScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  VehicleManagement: undefined;
  Settings: undefined;
  EmergencyContacts: undefined;
  PrivacyPolicy: undefined;
  PaymentMethods: undefined;
  LanguageSettings: undefined;
  HelpSupport: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={EnhancedProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen 
        name="VehicleManagement" 
        component={VehicleManagementScreen}
        options={{
          title: 'My Vehicles',
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Stack.Navigator>
  );
};
