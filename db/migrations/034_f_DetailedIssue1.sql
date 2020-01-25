DROP FUNCTION detailed_issue;

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
    creator JSON,
    comments JSON[],
    created_at TIMESTAMP,
    country VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        --- id ---
        i.id AS id,

        --- title ---
        i.title AS title, 

        --- short description ---
        i.short_description AS short_description, 

        --- detailed description ---
        i.detailed_description AS detailed_description,

        --- proposed solution ---
        i.proposed_solution AS proposed_solution,

        --- images ---
        i.images AS images,

        --- categories ---
        CAST(
            ARRAY(
                SELECT a.name 
                FROM categories a 
                WHERE a.id = ic.category_id
            ) AS TEXT[]
        ) AS categories,

        --- delegate to ---
        i.delegate_to AS delegate_to,

        --- solved ---
        i.solved AS solved,
        
        --- votes ---
        CAST((
            SELECT COUNT(u.id) 
            FROM upvotes u 
            WHERE issue_id = _issue_id
        ) AS INT) AS votes,

        --- voted ---
        (
            SELECT COUNT(u.id) = 1 
            FROM upvotes u 
            WHERE issue_id = _issue_id AND user_id = _user_id
        ) AS voted,

        --- supporters ---
        CAST(
            (
                SELECT COUNT(s.id) 
                FROM issue_supporter s 
                WHERE issue_id = _issue_id
            ) AS INT
        ) AS supporters,

        --- supporting ---
        (
            SELECT COUNT(s.id) = 1 
            FROM issue_supporter s 
            WHERE issue_id = _issue_id AND user_id = _user_id
        ) AS supporting,

        --- longitude ---
        i.longitude AS longitued,

        --- latitude ---
        i.latitude AS latitude,

        --- creator ---
        ROW_TO_JSON(
            CAST(
                (u.id, u.name, u.email, u.avatar) AS user_details
            )
        ) AS creator,

        --- comments ---
        ARRAY(
            SELECT 
                ROW_TO_JSON(
                    CAST((
                        CAST(
                            (cu.id, cu.name, cu.email, cu.avatar) AS user_details
                        ), 
                        ci.comment_text,
                        ci.created_at  
                    ) AS comment)
                )
            FROM issue_comments ci, users cu 
            WHERE ci.issue_id = _issue_id AND ci.user_id = cu.id
        ) AS comments,

        --- created at ---
        i.created_at AS created_at,

        --- country ---
        u.country AS country
    FROM 
        issues i, users u, issue_category ic
    WHERE 
        i.id = _issue_id AND i.created_by = u.id AND ic.issue_id = _issue_id;
END; $$ LANGUAGE 'plpgsql'; 