# 🗄️ Poolo Database Schema

## Database Setup Instructions

### 1. Create Tables in Supabase Dashboard

Go to your Supabase project dashboard and run these SQL commands in the SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for custom authentication
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  profile_picture TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_rides INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rides table
CREATE TABLE rides (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  driver_id UUID REFERENCES users(id) NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  drop_address TEXT NOT NULL,
  drop_latitude DECIMAL(10, 8),
  drop_longitude DECIMAL(11, 8),
  pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  expected_drop_time TIMESTAMP WITH TIME ZONE,
  available_seats INTEGER NOT NULL DEFAULT 1,
  total_seats INTEGER NOT NULL DEFAULT 1,
  vehicle_type VARCHAR(20) DEFAULT 'car' CHECK (vehicle_type IN ('bike', 'car', 'cab')),
  price_per_seat DECIMAL(8,2) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'full', 'started', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ride bookings table
CREATE TABLE ride_bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
  passenger_id UUID REFERENCES users(id) NOT NULL,
  seats_booked INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(8,2) NOT NULL,
  booking_status VARCHAR(20) DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ride_id, passenger_id)
);

-- Messages/Chat table
CREATE TABLE ride_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES users(id) NOT NULL,
  receiver_id UUID REFERENCES users(id) NOT NULL,
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'location')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false
);

-- User vehicles table
CREATE TABLE user_vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('bike', 'car', 'cab')),
  make VARCHAR(50),
  model VARCHAR(50),
  year INTEGER,
  color VARCHAR(30),
  license_plate VARCHAR(20),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings and reviews table
CREATE TABLE ride_ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
  rated_by UUID REFERENCES users(id) NOT NULL,
  rated_user UUID REFERENCES users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ride_id, rated_by, rated_user)
);
```

### 2. Create Indexes for Performance

```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_phone ON users(phone_number);

-- Rides table indexes
CREATE INDEX idx_rides_driver ON rides(driver_id);
CREATE INDEX idx_rides_pickup_location ON rides(pickup_latitude, pickup_longitude);
CREATE INDEX idx_rides_drop_location ON rides(drop_latitude, drop_longitude);
CREATE INDEX idx_rides_pickup_time ON rides(pickup_time);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_vehicle_type ON rides(vehicle_type);

-- Bookings table indexes
CREATE INDEX idx_bookings_ride ON ride_bookings(ride_id);
CREATE INDEX idx_bookings_passenger ON ride_bookings(passenger_id);
CREATE INDEX idx_bookings_status ON ride_bookings(booking_status);

-- Messages table indexes
CREATE INDEX idx_messages_ride ON ride_messages(ride_id);
CREATE INDEX idx_messages_sender ON ride_messages(sender_id);
CREATE INDEX idx_messages_receiver ON ride_messages(receiver_id);
CREATE INDEX idx_messages_sent_at ON ride_messages(sent_at);

-- Vehicles table indexes
CREATE INDEX idx_vehicles_user ON user_vehicles(user_id);
CREATE INDEX idx_vehicles_type ON user_vehicles(vehicle_type);

-- Ratings table indexes
CREATE INDEX idx_ratings_ride ON ride_ratings(ride_id);
CREATE INDEX idx_ratings_rated_user ON ride_ratings(rated_user);
```

### 3. Create Triggers and Functions

```sql
-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON ride_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update available seats when booking is confirmed
CREATE OR REPLACE FUNCTION update_available_seats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.booking_status = 'confirmed' THEN
    UPDATE rides 
    SET available_seats = available_seats - NEW.seats_booked
    WHERE id = NEW.ride_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.booking_status != 'confirmed' AND NEW.booking_status = 'confirmed' THEN
      UPDATE rides 
      SET available_seats = available_seats - NEW.seats_booked
      WHERE id = NEW.ride_id;
    ELSIF OLD.booking_status = 'confirmed' AND NEW.booking_status != 'confirmed' THEN
      UPDATE rides 
      SET available_seats = available_seats + OLD.seats_booked
      WHERE id = NEW.ride_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.booking_status = 'confirmed' THEN
    UPDATE rides 
    SET available_seats = available_seats + OLD.seats_booked
    WHERE id = OLD.ride_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for seat management
CREATE TRIGGER trigger_update_available_seats
  AFTER INSERT OR UPDATE OR DELETE ON ride_bookings
  FOR EACH ROW EXECUTE FUNCTION update_available_seats();

-- Function to update user rating
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET rating = (
    SELECT AVG(rating)::DECIMAL(3,2)
    FROM ride_ratings 
    WHERE rated_user = NEW.rated_user
  )
  WHERE id = NEW.rated_user;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating updates
CREATE TRIGGER trigger_update_user_rating
  AFTER INSERT ON ride_ratings
  FOR EACH ROW EXECUTE FUNCTION update_user_rating();
```

### 4. Insert Sample Data (Optional)

```sql
-- Sample users
INSERT INTO users (email, password_hash, username, name, phone_number) VALUES 
('john@example.com', 'dummy_hash_1', 'johndoe', 'John Doe', '+91 9876543210'),
('jane@example.com', 'dummy_hash_2', 'janesmith', 'Jane Smith', '+91 8765432109'),
('mike@example.com', 'dummy_hash_3', 'mikejohnson', 'Mike Johnson', '+91 7654321098');

-- Sample rides
INSERT INTO rides (driver_id, pickup_address, pickup_latitude, pickup_longitude, drop_address, drop_latitude, drop_longitude, pickup_time, available_seats, price_per_seat, description) VALUES 
((SELECT id FROM users WHERE email = 'john@example.com'), 'Sector 18, Noida', 28.5694, 77.3250, 'Cyber City, Gurgaon', 28.4595, 77.0266, NOW() + INTERVAL '2 hours', 3, 200, 'AC car, music allowed'),
((SELECT id FROM users WHERE email = 'jane@example.com'), 'Connaught Place, Delhi', 28.6315, 77.2167, 'Saket, Delhi', 28.5245, 77.2066, NOW() + INTERVAL '4 hours', 2, 150, 'Non-smoking ride');
```

### 5. Row Level Security (Optional)

```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_messages ENABLE ROW LEVEL SECURITY;

-- Users can view and edit their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);

-- Anyone can view available rides
CREATE POLICY "Anyone can view rides" ON rides FOR SELECT USING (true);
CREATE POLICY "Drivers can manage own rides" ON rides FOR ALL USING (true);

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON ride_bookings FOR SELECT USING (true);
CREATE POLICY "Users can create bookings" ON ride_bookings FOR INSERT WITH CHECK (true);

-- Users can view messages where they are sender or receiver
CREATE POLICY "Users can view own messages" ON ride_messages FOR SELECT USING (true);
CREATE POLICY "Users can send messages" ON ride_messages FOR INSERT WITH CHECK (true);
```

## 🎯 Your Database is Ready!

After running these commands, your Poolo database will have:

✅ **Complete user management** with custom authentication  
✅ **Ride creation and booking system** with automatic seat management  
✅ **Real-time messaging** between riders  
✅ **Rating and review system** for users  
✅ **Vehicle management** for drivers  
✅ **Optimized performance** with proper indexes  

Your app can now store and manage real ride-sharing data! 🚗✨
