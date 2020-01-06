CREATE TABLE IF NOT EXISTS upvotes (
    id SERIAL,
    issue_id INT REFERENCES issues(id),
    user_id INT REFERENCES users(id)
)