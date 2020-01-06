CREATE TABLE IF NOT EXISTS issue_category (
    id SERIAL PRIMARY KEY,

    issue_id INT NOT NULL REFERENCES issues(id),
    category_id INT NOT NULL REFERENCES categories(id)
);
