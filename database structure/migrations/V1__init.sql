-- migrations/V1__init.sql – full schema

-- Reference tables (enums)
CREATE TABLE severity_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
INSERT INTO severity_levels (name) VALUES ('Low'),('Moderate'),('High');

CREATE TABLE input_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
INSERT INTO input_types (name) VALUES ('text'),('voice'),('photo'),('whatsapp'),('social');

-- Core tables
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    latitude REAL CHECK (latitude BETWEEN -90 AND 90),
    longitude REAL CHECK (longitude BETWEEN -180 AND 180),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    citizen_name TEXT,
    contact_info TEXT,
    input_type_id INTEGER NOT NULL REFERENCES input_types(id),
    content TEXT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    location_id INTEGER NOT NULL REFERENCES locations(id),
    severity_id INTEGER NOT NULL REFERENCES severity_levels(id),
    affected_count INTEGER CHECK (affected_count >= 0),
    media_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- View for priority scoring
CREATE VIEW complaint_priority AS
SELECT c.id,
       s.name AS severity,
       c.affected_count,
       (CASE s.name WHEN 'High' THEN 3 WHEN 'Moderate' THEN 2 ELSE 1 END) *
       COALESCE(c.affected_count,1) AS rank_score,
       c.submission_time,
       cat.name AS category,
       loc.name AS location
FROM complaints c
JOIN severity_levels s ON c.severity_id = s.id
JOIN categories cat ON c.category_id = cat.id
JOIN locations loc ON c.location_id = loc.id;

-- Indexes for performance
CREATE INDEX idx_complaints_submission_time ON complaints(submission_time);
CREATE INDEX idx_complaints_category_id ON complaints(category_id);
CREATE INDEX idx_complaints_location_id ON complaints(location_id);
CREATE INDEX idx_complaint_priority_rank ON complaint_priority(rank_score);
