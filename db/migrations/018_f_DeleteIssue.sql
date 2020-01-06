CREATE OR REPLACE FUNCTION delete_issue(_id INT)
RETURNS void AS $$
BEGIN
    DELETE FROM issue_category WHERE issue_id = _id;
    DELETE FROM issue_supporter WHERE issue_id = _id;

    DELETE FROM issues WHERE id = _id;
END; $$ LANGUAGE 'plpgsql'; 