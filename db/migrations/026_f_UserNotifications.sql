CREATE OR REPLACE FUNCTION user_notifications (_user_id INT, _unread_only BOOLEAN)
RETURNS notifications AS $$
DECLARE
    notification_data notifications;
BEGIN  
    IF _unread_only THEN
        SELECT * FROM notifications WHERE receiving_user=_user_id AND is_read=FALSE INTO notification_data;
    ELSE
        SELECT * FROM notifications WHERE receiving_user=_user_id INTO notification_data;
    END IF;
RETURN notification_data;
END; $$ LANGUAGE 'plpgsql';