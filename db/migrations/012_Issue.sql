CREATE TABLE IF NOT EXISTS issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    detailed_description TEXT NOT NULL,
    proposed_solution TEXT,
    images TEXT[],
    solved BOOLEAN DEFAULT FALSE,
    longitude NUMERIC,
    latitude NUMERIC,
    delegate_to INT,
    
    created_by INT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
