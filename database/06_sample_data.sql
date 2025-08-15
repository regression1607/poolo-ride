-- Sample data for testing (optional)
-- Note: This is for testing purposes only. Remove in production.

-- Insert sample users (these will be created automatically when users sign up)
-- The trigger will handle user creation, so this is just for reference

-- Sample rides (you can uncomment and modify these after users are created)
/*
INSERT INTO rides (user_id, pickup_location, pickup_latitude, pickup_longitude, dropoff_location, dropoff_latitude, dropoff_longitude, mode, price, pickup_time, person_count, available_seats) VALUES
(
  (SELECT id FROM users LIMIT 1),
  'Connaught Place, New Delhi',
  28.6315,
  77.2167,
  'Cyber City, Gurgaon',
  28.4949,
  77.0816,
  'Car',
  250.00,
  NOW() + INTERVAL '2 hours',
  3,
  3
),
(
  (SELECT id FROM users LIMIT 1),
  'Faridabad Bus Stand',
  28.4089,
  77.3178,
  'Noida Sector 18',
  28.5706,
  77.3261,
  'Car',
  200.00,
  NOW() + INTERVAL '1 day',
  2,
  2
);
*/

-- Create indexes for full-text search on locations
CREATE INDEX IF NOT EXISTS idx_rides_pickup_location_fts ON rides USING gin(to_tsvector('english', pickup_location));
CREATE INDEX IF NOT EXISTS idx_rides_dropoff_location_fts ON rides USING gin(to_tsvector('english', dropoff_location));
