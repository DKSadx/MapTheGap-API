CREATE TABLE IF NOT EXISTS issue_comments(
    id SERIAL,

    user_id INT NOT NULL REFERENCES users(id),
    issue_id INT NOT NULL REFERENCES issues(id),

    comment_text TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);
