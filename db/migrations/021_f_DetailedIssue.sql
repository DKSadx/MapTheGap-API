CREATE OR REPLACE FUNCTION detailed_issue(_issue_id INT, _user_id INT)
RETURNS TABLE (
    id INT, 
    title VARCHAR(255), 
    short_description TEXT, 
    detailed_description TEXT, 
    proposed_solution TEXT, 
    images TEXT[], 
    solved BOOLEAN, 
    upvotes INT,
    upvoted BOOLEAN,
    supporters INT,
    supporting BOOLEAN,
    longitued NUMERIC, 
    latitude NUMERIC,
    creator_id INT,
    creator_name VARCHAR(63), 
    creator_avatar TEXT,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id AS id,
        i.title AS title, 
        i.short_description AS short_description, 
        i.detailed_description AS detailed_description,
        i.proposed_solution AS proposed_solution,
        i.images AS images,
        i.solved AS solved,
        CAST((SELECT COUNT(u.id) FROM upvotes u WHERE issue_id = _issue_id) AS INT) AS votes,
        (SELECT COUNT(u.id) = 1 FROM upvotes u WHERE issue_id = _issue_id AND user_id = _user_id) AS voted,
        CAST((SELECT COUNT(s.id) FROM issue_supporter s WHERE issue_id = _issue_id) AS INT) AS supporters,
        (SELECT COUNT(s.id) = 1 FROM issue_supporter s WHERE issue_id = _issue_id AND user_id = _user_id) AS supporting,
        i.longitude AS longitued,
        i.latitude AS latitude,
        u.id AS creator_id,
        u.name AS creator_name,
        u.avatar AS creator_avatar,
        i.created_at AS created_at
    FROM 
        issues i, users u
    WHERE 
        i.id = _issue_id AND i.created_by = u.id;
END; $$ LANGUAGE 'plpgsql'; 