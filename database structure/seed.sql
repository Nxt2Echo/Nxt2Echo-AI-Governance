-- Seed data for enums, reference tables and sample records

INSERT INTO severity_levels (name) VALUES ('Low'),('Moderate'),('High');
INSERT INTO input_types (name) VALUES ('text'),('voice'),('photo'),('whatsapp'),('social');
INSERT INTO categories (name, description) VALUES
    ('Water Shortage','Insufficient water supply'),
    ('Garbage Overflow','Uncollected waste'),
    ('Road Damage','Potholes and broken roads');
INSERT INTO locations (name, latitude, longitude) VALUES
    ('Main Street',12.9716,77.5946),
    ('Central Park',12.9750,77.6050);
INSERT INTO complaints (citizen_name, contact_info, input_type_id, content, category_id, location_id, severity_id, affected_count, media_path)
VALUES
    ('Alice','alice@example.com',1,'Pothole on Main St.',3,1,2,150,NULL),
    ('Bob','bob@example.com',1,'Overflowing garbage bins.',2,2,3,200,NULL);
