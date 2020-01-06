CREATE TABLE IF NOT EXISTS user_area (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    area_id INT NOT NULL REFERENCES areas(id)
);
