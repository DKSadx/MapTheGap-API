CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_type INT NOT NULL REFERENCES user_types(id),

    name VARCHAR(63) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    address VARCHAR(255),
    date_of_birth DATE,
    avatar TEXT,

    password VARCHAR(63) NOT NULL,

    company_type VARCHAR(255),

    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW(),
    verified BOOLEAN NOT NULL DEFAULT FALSE
);
