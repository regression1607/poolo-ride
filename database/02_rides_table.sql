-- Create rides table
CREATE TABLE IF NOT EXISTS rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  pickup_location TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  dropoff_location TEXT NOT NULL,
  dropoff_latitude DECIMAL(10, 8),
  dropoff_longitude DECIMAL(11, 8),
  mode TEXT NOT NULL CHECK (mode IN ('Bike', 'Car', 'Cab')),
  price DECIMAL(10, 2) NOT NULL,
  pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  dropoff_time TIMESTAMP WITH TIME ZONE,
  person_count INTEGER NOT NULL DEFAULT 1 CHECK (person_count >= 1 AND person_count <= 4),
  available_seats INTEGER NOT NULL DEFAULT 1 CHECK (available_seats >= 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- Create policies for rides table
CREATE POLICY "Anyone can read active rides" ON rides
  FOR SELECT USING (status = 'active' OR auth.uid() IN (
    SELECT auth_id FROM users WHERE id = rides.user_id
  ));

CREATE POLICY "Users can insert own rides" ON rides
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT auth_id FROM users WHERE id = rides.user_id
  ));

CREATE POLICY "Users can update own rides" ON rides
  FOR UPDATE USING (auth.uid() IN (
    SELECT auth_id FROM users WHERE id = rides.user_id
  ));

CREATE POLICY "Users can delete own rides" ON rides
  FOR DELETE USING (auth.uid() IN (
    SELECT auth_id FROM users WHERE id = rides.user_id
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_rides_pickup_time ON rides(pickup_time);
CREATE INDEX IF NOT EXISTS idx_rides_location ON rides(pickup_latitude, pickup_longitude, dropoff_latitude, dropoff_longitude);
