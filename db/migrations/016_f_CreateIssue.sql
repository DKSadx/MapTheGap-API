CREATE OR REPLACE FUNCTION create_issue (
    _title VARCHAR(255),
    _short_description TEXT,
    _detailed_description TEXT,
    _proposed_solution TEXT,
    _images TEXT[],
    _participate BOOLEAN,
    _categories INT[],
    _delegate_to INT,
    _created_by INT,
    _longitude NUMERIC,
    _latitude NUMERIC
) RETURNS issues AS $$

DECLARE 
    issue_data issues;
    i INT;
    contact_person INT;
BEGIN
    IF _participate THEN
        contact_person := _created_by;
    END IF;

    INSERT INTO issues (title, short_description, detailed_description, proposed_solution, images, longitude, latitude, delegate_to, created_by) 
    VALUES (_title, _short_description, _detailed_description, _proposed_solution, _images, _longitude, _latitude, _delegate_to, _created_by)
    RETURNING * INTO issue_data;

    IF _categories IS NOT NULL THEN
		FOREACH i IN ARRAY _categories LOOP
			INSERT INTO issue_catogory (issue_id, category_id) VALUES (issue_data.id, i);
		END LOOP;
	END IF;

    IF _participate THEN
        INSERT INTO issue_supporter(issue_id, user_id) VALUES (issue_data.id, _created_by);
    END IF;
RETURN 
    issue_data;
END; $$ LANGUAGE 'plpgsql';