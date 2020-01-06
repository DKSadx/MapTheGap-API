CREATE TABLE IF NOT EXISTS user_category (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    category_id INT NOT NULL REFERENCES categories(id)
);
