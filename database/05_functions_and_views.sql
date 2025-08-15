-- Create function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL(10, 8),
  lon1 DECIMAL(11, 8),
  lat2 DECIMAL(10, 8),
  lon2 DECIMAL(11, 8)
) RETURNS DECIMAL(10, 2) AS $$
DECLARE
  R CONSTANT DECIMAL := 6371; -- Earth's radius in kilometers
  dLat DECIMAL;
  dLon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dLat := RADIANS(lat2 - lat1);
  dLon := RADIANS(lon2 - lon1);
  
  a := SIN(dLat/2) * SIN(dLat/2) + 
       COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * 
       SIN(dLon/2) * SIN(dLon/2);
  
  c := 2 * ATAN2(SQRT(a), SQRT(1-a));
  
  RETURN R * c;
END;
$$ LANGUAGE plpgsql;

-- Create view for rides with user details
CREATE OR REPLACE VIEW rides_with_user AS
SELECT 
  r.*,
  u.name as user_name,
  u.rating as user_rating,
  u.total_rides as user_total_rides,
  u.profile_image as user_profile_image,
  (
    SELECT COUNT(*)
    FROM ride_requests rr
    WHERE rr.ride_id = r.id AND rr.status = 'pending'
  ) as pending_requests_count
FROM rides r
JOIN users u ON r.user_id = u.id;

-- Create view for user conversations
CREATE OR REPLACE VIEW user_conversations AS
SELECT DISTINCT
  CASE 
    WHEN m.sender_id = u.id THEN m.receiver_id
    ELSE m.sender_id
  END as conversation_with_user_id,
  u.id as user_id,
  m.ride_id,
  MAX(m.created_at) as last_message_time,
  COUNT(CASE WHEN m.receiver_id = u.id AND m.read_at IS NULL THEN 1 END) as unread_count
FROM messages m
JOIN users u ON (u.id = m.sender_id OR u.id = m.receiver_id)
GROUP BY 
  CASE 
    WHEN m.sender_id = u.id THEN m.receiver_id
    ELSE m.sender_id
  END,
  u.id,
  m.ride_id;

-- Create function to update ride available seats when request is accepted
CREATE OR REPLACE FUNCTION update_ride_seats()
RETURNS TRIGGER AS $$
BEGIN
  -- If request status changed to accepted, decrease available seats
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    UPDATE rides 
    SET available_seats = available_seats - NEW.seats_requested
    WHERE id = NEW.ride_id;
  END IF;
  
  -- If request status changed from accepted to rejected/cancelled, increase available seats
  IF OLD.status = 'accepted' AND NEW.status IN ('rejected', 'cancelled') THEN
    UPDATE rides 
    SET available_seats = available_seats + NEW.seats_requested
    WHERE id = NEW.ride_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating ride seats
CREATE OR REPLACE TRIGGER trigger_update_ride_seats
  AFTER UPDATE ON ride_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_ride_seats();
