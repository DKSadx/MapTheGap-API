CREATE OR REPLACE FUNCTION update_issue(
    _id INT,
    _title VARCHAR(255),
    _short_description TEXT,
    _detailed_description TEXT,
    _proposed_solution TEXT,
    _images TEXT[],
    _participate BOOLEAN,
    _categories INT[],
    _delegate_to INT,
    _longitude NUMERIC,
    _latitude NUMERIC
) RETURNS issues AS $$

DECLARE
    issue_data issues;
    i INT;
BEGIN
    SELECT * FROM issues WHERE id = _id INTO issue_data;
    
    IF _title IS NOT NULL THEN
        issue_data.title := _title;
    END IF;

    IF _short_description IS NOT NULL THEN
        issue_data.short_description := _short_description;
    END IF;

    IF _detailed_description IS NOT NULL THEN
        issue_data.detailed_description := _detailed_description;
    END IF;

    IF _proposed_solution IS NOT NULL THEN
        issue_data.proposed_solution := _proposed_solution;
    END IF;

    IF _images IS NOT NULL THEN
        issue_data.images := _images;
    END IF;

    IF _images IS NOT NULL THEN
        issue_data.title := _images;
    END IF;

    IF _participate IS NOT NULL AND _participate != ((SELECT issue_id FROM issue_supporter WHERE issue_id = _id AND user_id = issue_data.created_by) IS NOT NULL) THEN
        IF _participate THEN
            INSERT INTO issue_supporter(user_id, issue_id) VALUES (issue_data.created_by, _id);
        ELSE
            DELETE FROM  issue_supporter WHERE issue_id = _id AND user_id = issue_data.created_by;
        END IF;
    END IF;

    UPDATE issues SET
        id = issue_data.id,
        title = issue_data.title,
        short_description = issue_data.short_description,
        detailed_description = issue_data.detailed_description,
        proposed_solution = issue_data.proposed_solution,
        images = issue_data.images,
        longitude = issue_data.longitude,
        latitude = issue_data.latitude,
        delegate_to = issue_data.delegate_to
    WHERE id = _id;


    IF _categories IS NOT NULL THEN
        DELETE FROM issues WHERE issue_id = _id;

        FOREACH i IN ARRAY _categories LOOP
			INSERT INTO issue_catogory (issue_id, category_id) VALUES (_id, i);
		END LOOP;
    END IF;
RETURN issue_data;
END; $$ LANGUAGE 'plpgsql'; 