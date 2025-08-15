-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'user' CHECK (message_type IN ('user', 'system')),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages table
CREATE POLICY "Users can read their own messages" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT auth_id FROM users WHERE id = messages.sender_id
    ) OR
    auth.uid() IN (
      SELECT auth_id FROM users WHERE id = messages.receiver_id
    )
  );

CREATE POLICY "Users can insert their own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT auth_id FROM users WHERE id = messages.sender_id
  ));

CREATE POLICY "Users can update read status of their received messages" ON messages
  FOR UPDATE USING (auth.uid() IN (
    SELECT auth_id FROM users WHERE id = messages.receiver_id
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_ride_id ON messages(ride_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
