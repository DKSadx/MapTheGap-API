CREATE OR REPLACE FUNCTION verify_user(_id VARCHAR(31))
RETURNS void AS $$
BEGIN
    IF (SELECT count(id) FROM user_verification WHERE id = _id) > 0 THEN
        UPDATE users SET verified = TRUE WHERE id = (SELECT user_id FROM user_verification WHERE id = _id);
    END IF;
END; $$ LANGUAGE 'plpgsql'; 
