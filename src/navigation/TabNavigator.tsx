import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { TabParamList } from '../types/navigation';

// Import screen components (we'll create these next)
import { SearchScreen } from '../screens/search/SearchScreen';
import { PublishScreen } from '../screens/publish/PublishScreen';
import { RidesScreen } from '../screens/rides/RidesScreen';
import { InboxScreen } from '../screens/InboxScreen';
import { ProfileNavigator } from './ProfileNavigator';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'SearchTab':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'PublishTab':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'RidesTab':
              iconName = focused ? 'car' : 'car-outline';
              break;
            case 'InboxTab':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'home';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.neutral[600],
        tabBarStyle: {
          backgroundColor: colors.neutral.white,
          borderTopColor: colors.neutral[200],
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 84,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: colors.neutral.white,
          borderBottomColor: colors.neutral[200],
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: colors.neutral[900],
        },
        headerTintColor: colors.neutral[900],
      })}
    >
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          title: 'Search',
          headerTitle: '🔍 Find Rides',
        }}
      />
      <Tab.Screen
        name="PublishTab"
        component={PublishScreen}
        options={{
          title: 'Publish',
          headerTitle: '📝 Publish Ride',
        }}
      />
      <Tab.Screen
        name="RidesTab"
        component={RidesScreen}
        options={{
          title: 'My Rides',
          headerTitle: '🚗 My Rides',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="InboxTab"
        component={InboxScreen}
        options={{
          title: 'Inbox',
          headerTitle: '💬 Messages',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          title: 'Profile',
          headerTitle: '👤 Profile',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};
