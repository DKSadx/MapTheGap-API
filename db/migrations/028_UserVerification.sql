CREATE TABLE IF NOT EXISTS user_verification (
    id VARCHAR(31) NOT NULL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id)
)