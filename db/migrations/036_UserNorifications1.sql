DROP FUNCTION IF EXISTS user_notifications (_user_id INT, _unread_only BOOLEAN);

CREATE OR REPLACE FUNCTION user_notifications (_user_id INT, _unread_only BOOLEAN)
RETURNS TABLE (
    id integer,
    
    type varchar(63),

    issue_title varchar(255),
    issue_short_description TEXT,

    user_name varchar(63),
    user_avatar text,

    is_read boolean
) AS $$
BEGIN  
    IF _unread_only THEN
        return query SELECT 
            n.id, 
            nt.name as type, 
            i.title as issue_title,
            i.short_description as issue_short_description,
            u.name as user_name,
            u.avatar as user_avatar,
            n.is_read
        FROM notifications n 
            JOIN notification_types nt ON n.type = nt.id
            JOIN users u ON n.user_id = u.id
            JOIN issues i on n.issue_id = i.id 
        WHERE n.receiving_user=_user_id
            AND n.is_read=FALSE;
    ELSE
        return query SELECT 
            n.id, 
            nt.name as type, 
            i.title as issue_title,
            i.short_description as issue_short_description,
            u.name as user_name,
            u.avatar as user_avatar,
            n.is_read
        FROM notifications n 
            JOIN notification_types nt ON n.type = nt.id
            JOIN users u ON n.user_id = u.id
            JOIN issues i on n.issue_id = i.id 
        WHERE n.receiving_user=_user_id;
    END IF;
END; $$ LANGUAGE 'plpgsql';