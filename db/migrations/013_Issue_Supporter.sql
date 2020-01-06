CREATE TABLE IF NOT EXISTS issue_supporter (
    id SERIAL PRIMARY KEY,

    user_id INT REFERENCES users(id),
    issue_id INT REFERENCES issues(id)
)