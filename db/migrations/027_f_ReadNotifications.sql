CREATE OR REPLACE FUNCTION read_notifications (_user_id INT)
RETURNS void AS $$
BEGIN  
    UPDATE notifications SET is_read = TRUE WHERE receiving_user = _user_id;
END; $$ LANGUAGE 'plpgsql';