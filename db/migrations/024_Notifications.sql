CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY, 

    type INT REFERENCES notification_types(id),
    receiving_user INT REFERENCES users(id),

    issue_id INT REFERENCES issues(id),
    user_id INT REFERENCES users(id),

    is_read BOOLEAN DEFAULT FALSE
)