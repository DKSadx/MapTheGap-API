CREATE OR REPLACE FUNCTION detailed_issue(_issue_id INT, _user_id INT)
RETURNS TABLE (
    id INT, 
    title VARCHAR(255), 
    short_description TEXT, 
    detailed_description TEXT, 
    proposed_solution TEXT, 
    images TEXT[], 
    categories TEXT[],
    delegate_to INT,
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
        CAST(ARRAY(SELECT a.name from categories a where a.id = ic.category_id) AS TEXT[]) AS categories,
        i.delegate_to AS delegate_to,
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
        issues i, users u, issue_category ic
    WHERE 
        i.id = _issue_id AND i.created_by = u.id AND ic.issue_id = _issue_id;
END; $$ LANGUAGE 'plpgsql'; 