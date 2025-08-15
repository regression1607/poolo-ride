# Poolo-Ride - Ridesharing Application

Poolo-Ride is a React Native ridesharing application that connects users who want to share rides using bikes, cars, or cabs. The app features a clean white and black theme with dark theme as default.

## Features

- **Authentication**: Login and registration with Supabase
- **Ride Search**: Find rides based on location, mode of transport, and passenger count
- **Ride Publishing**: Publish rides with pickup/dropoff locations, price, and timing
- **Ride Management**: Track your published rides and received requests
- **Messaging**: In-app messaging with riders/passengers
- **User Profiles**: Manage profile, settings, and preferences

## Tech Stack

- React Native
- Expo
- TypeScript
- Supabase (Authentication & Database)
- MapLibre GL for mapping
- React Navigation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/poolo-ride.git
cd poolo-ride
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env` file in the root directory with your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npx expo start
```

### Supabase Setup

1. Create a new Supabase project
2. Set up the following tables:
   - `users`: id, name, email, created_at, profile_data
   - `rides`: id, user_id, pickup_location, dropoff_location, mode, price, pickup_time, person_count, status, created_at
   - `ride_requests`: id, ride_id, requester_id, status, created_at
   - `messages`: id, ride_id, sender_id, receiver_id, message, created_at

3. Configure authentication providers in the Supabase dashboard

## Application Structure

```
src/
├── components/         # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── services/           # API calls, Supabase client
├── context/            # Context providers
├── utils/              # Helper functions
├── assets/             # Images, fonts
├── themes/             # Theme configuration
└── types/              # TypeScript types
```

## Development Workflow

1. Run the app in development mode: `npx expo start`
2. Choose a platform:
   - Press `i` to run on iOS simulator
   - Press `a` to run on Android emulator
   - Scan the QR code with Expo Go app on your device

## License

This project is licensed under the MIT License - see the LICENSE file for details.
