create database nxt;
use nxt;
-- Citizens submitting complaints
CREATE TABLE Citizens (
    citizen_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    contact_info VARCHAR(150),
    location VARCHAR(150)
);

-- Raw complaints
CREATE TABLE Complaints (
    complaint_id INT PRIMARY KEY AUTO_INCREMENT,
    citizen_id INT,
    input_type ENUM('voice','text','photo','social_media'),
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES Citizens(citizen_id)
);

-- AI issue detection
CREATE TABLE Issues (
    issue_id INT PRIMARY KEY AUTO_INCREMENT,
    complaint_id INT,
    category VARCHAR(100),
    severity ENUM('high','medium','low'),
    affected_population INT,
    FOREIGN KEY (complaint_id) REFERENCES Complaints(complaint_id)
);

-- Priority engine
CREATE TABLE Priority (
    priority_id INT PRIMARY KEY AUTO_INCREMENT,
    issue_id INT,
    priority_score INT,
    rank_order INT,
    FOREIGN KEY (issue_id) REFERENCES Issues(issue_id)
);

-- Geo-spatial heatmap
CREATE TABLE Heatmap (
    map_id INT PRIMARY KEY AUTO_INCREMENT,
    issue_id INT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    zone_type VARCHAR(100),
    FOREIGN KEY (issue_id) REFERENCES Issues(issue_id)
);

-- Predictive alerts
CREATE TABLE Alerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    issue_id INT,
    predicted_risk_level VARCHAR(50),
    alert_message TEXT,
    alert_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES Issues(issue_id)
);
