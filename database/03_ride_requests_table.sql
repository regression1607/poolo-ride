-- Create ride_requests table
CREATE TABLE IF NOT EXISTS ride_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  seats_requested INTEGER NOT NULL DEFAULT 1 CHECK (seats_requested >= 1),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can't request the same ride multiple times
  UNIQUE(ride_id, requester_id)
);

-- Enable Row Level Security
ALTER TABLE ride_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for ride_requests table
CREATE POLICY "Users can read requests for their rides or their own requests" ON ride_requests
  FOR SELECT USING (
    auth.uid() IN (
      SELECT auth_id FROM users WHERE id = ride_requests.requester_id
    ) OR
    auth.uid() IN (
      SELECT users.auth_id FROM users 
      JOIN rides ON rides.user_id = users.id 
      WHERE rides.id = ride_requests.ride_id
    )
  );

CREATE POLICY "Users can insert their own requests" ON ride_requests
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT auth_id FROM users WHERE id = ride_requests.requester_id
  ));

CREATE POLICY "Users can update requests for their rides or their own requests" ON ride_requests
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT auth_id FROM users WHERE id = ride_requests.requester_id
    ) OR
    auth.uid() IN (
      SELECT users.auth_id FROM users 
      JOIN rides ON rides.user_id = users.id 
      WHERE rides.id = ride_requests.ride_id
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ride_requests_ride_id ON ride_requests(ride_id);
CREATE INDEX IF NOT EXISTS idx_ride_requests_requester_id ON ride_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_ride_requests_status ON ride_requests(status);
