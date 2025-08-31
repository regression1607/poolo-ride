export type RootStackParamList = {
  // Main Navigation
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type TabParamList = {
  SearchTab: undefined;
  PublishTab: undefined;
  RidesTab: { initialTab?: 'published' | 'booked' } | undefined;
  InboxTab: undefined;
  ProfileTab: undefined;
};

export type SearchStackParamList = {
  Search: undefined;
  RideDetails: { rideId: string };
  BookRide: { rideId: string };
};

export type PublishStackParamList = {
  Publish: undefined;
  CreateRide: undefined;
};

export type RidesStackParamList = {
  Rides: undefined;
  ManageRide: { rideId: string };
};

export type InboxStackParamList = {
  Inbox: undefined;
  Chat: { rideId: string; partnerId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  RideHistory: undefined;
  VehicleManagement: undefined;
};
