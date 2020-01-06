CREATE OR REPLACE FUNCTION create_user (
    _user_type INT,
    _name VARCHAR(63),
    _email VARCHAR(255),
    _phone_number VARCHAR(15),
    _address VARCHAR(255),
    _date_of_birth DATE,
    _password VARCHAR(63),
    _company_type VARCHAR(255),
    _categories INT[],
    _areas INT[]
) RETURNS users AS $$ 

DECLARE
	user_data users;
	i INT;
BEGIN
	INSERT INTO users (user_type, name, email, phone_number, address, date_of_birth, password, company_type) VALUES (
		_user_type, _name, _email, _phone_number, _address, _date_of_birth, _password, _company_type
	) RETURNING 
		id, user_type, name, email, phone_number, address, date_of_birth, company_type, verified
	INTO user_data;
	
	IF _categories IS NOT NULL THEN
		FOREACH i IN ARRAY _categories LOOP
			INSERT INTO user_category (user_id, category_id) VALUES (user_data.id, i);
		END LOOP;
	END IF;
	
	IF _areas IS NOT NULL THEN
		FOREACH i IN ARRAY _areas LOOP
			INSERT INTO user_area (user_id, area_id) VALUES (user_data.id, i);
		END LOOP;
	END IF;

RETURN user_data;

END; $$ LANGUAGE 'plpgsql';