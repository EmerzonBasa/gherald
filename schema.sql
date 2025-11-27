-- CRL Digital Filing System Database Schema
-- Import this file into your XAMPP MySQL/phpMyAdmin

CREATE DATABASE IF NOT EXISTS crl_filing_system;
USE crl_filing_system;

-- Users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'user', 'viewer') DEFAULT 'user',
    can_view BOOLEAN DEFAULT TRUE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_upload BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_print BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- OTP verification table
CREATE TABLE otp_verification (
    otp_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_otp (user_id, otp_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Companies table
CREATE TABLE companies (
    company_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(100) NOT NULL,
    company_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_company_code (company_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Document categories (main folders)
CREATE TABLE document_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(255) NOT NULL,
    parent_category_id INT NULL,
    category_path VARCHAR(500),
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES document_categories(category_id) ON DELETE CASCADE,
    INDEX idx_parent (parent_category_id),
    INDEX idx_path (category_path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Documents table
CREATE TABLE documents (
    document_id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    category_id INT NOT NULL,
    ao_name VARCHAR(255),
    file_description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(50),
    document_year INT,
    document_month INT,
    scanned_date DATE,
    storage_location VARCHAR(255),
    page_count INT,
    uploaded_by INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    INDEX idx_company (company_id),
    INDEX idx_category (category_id),
    INDEX idx_year_month (document_year, document_month),
    INDEX idx_uploaded (uploaded_by),
    INDEX idx_deleted (is_deleted),
    FOREIGN KEY (company_id) REFERENCES companies(company_id),
    FOREIGN KEY (category_id) REFERENCES document_categories(category_id),
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id),
    FOREIGN KEY (deleted_by) REFERENCES users(user_id),
    FULLTEXT INDEX idx_fulltext_search (file_description, file_name, ao_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Document access log
CREATE TABLE document_access_log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    document_id INT NOT NULL,
    user_id INT NOT NULL,
    action_type ENUM('view', 'download', 'print', 'edit', 'delete', 'restore') NOT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    FOREIGN KEY (document_id) REFERENCES documents(document_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_document (document_id),
    INDEX idx_user (user_id),
    INDEX idx_timestamp (action_timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Document versions (for edit history)
CREATE TABLE document_versions (
    version_id INT PRIMARY KEY AUTO_INCREMENT,
    document_id INT NOT NULL,
    version_number INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    modified_by INT NOT NULL,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    change_notes TEXT,
    FOREIGN KEY (document_id) REFERENCES documents(document_id) ON DELETE CASCADE,
    FOREIGN KEY (modified_by) REFERENCES users(user_id),
    INDEX idx_document (document_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User activity log
CREATE TABLE user_activity_log (
    activity_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user (user_id),
    INDEX idx_timestamp (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default companies
INSERT INTO companies (company_name, company_code, description) VALUES
('LOYOLA', 'LOYOLA', 'Loyola Company Documents'),
('CARITAS', 'CARITAS', 'Caritas Company Documents'),
('PPLIC', 'PPLIC', 'PPLIC Company Documents'),
('ETERNAL', 'ETERNAL', 'Eternal Company Documents');

-- Insert document categories structure
INSERT INTO document_categories (category_name, parent_category_id, category_path, display_order) VALUES
-- Main folders
('Quarterly Reports', NULL, '/Quarterly Reports', 1),
('IC Reply Letters', NULL, '/IC Reply Letters', 2),
('Incoming & Outgoing Communications', NULL, '/Incoming & Outgoing Communications', 3),
('Examination & Verification', NULL, '/Examination & Verification', 4),
('Claims', NULL, '/Claims', 5),
('Bank/Financial Statements', NULL, '/Bank/Financial Statements', 6),
('Division Files', NULL, '/Division Files', 7);

-- Sub folders for Incoming & Outgoing Communications
INSERT INTO document_categories (category_name, parent_category_id, category_path, display_order) VALUES
('Company letters and IC responses',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Incoming & Outgoing Communications'),
 '/Incoming & Outgoing Communications/Company letters and IC responses', 1),
('Communications related to rehabilitation, liquidation, and distribution plans',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Incoming & Outgoing Communications'),
 '/Incoming & Outgoing Communications/Communications related to rehabilitation, liquidation, and distribution plans', 2),
('Servicing plan correspondence',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Incoming & Outgoing Communications'),
 '/Incoming & Outgoing Communications/Servicing plan correspondence', 3),
('Closure and Termination of Liquidation Proceedings',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Incoming & Outgoing Communications'),
 '/Incoming & Outgoing Communications/Closure and Termination of Liquidation Proceedings', 4),
('Miscellaneous IC and company letters',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Incoming & Outgoing Communications'),
 '/Incoming & Outgoing Communications/Miscellaneous IC and company letters', 5);

-- Sub folders for Examination & Verification
INSERT INTO document_categories (category_name, parent_category_id, category_path, display_order) VALUES
('Annual Statement and Audited Financial Statements',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Examination & Verification'),
 '/Examination & Verification/Annual Statement and Audited Financial Statements', 1),
('IC transmittal letters',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Examination & Verification'),
 '/Examination & Verification/IC transmittal letters', 2),
('Working balance sheets, schedules, and supporting documents',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Examination & Verification'),
 '/Examination & Verification/Working balance sheets, schedules, and supporting documents', 3),
('Office orders and designation letters',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Examination & Verification'),
 '/Examination & Verification/Office orders and designation letters', 4);

-- Sub folders for Claims
INSERT INTO document_categories (category_name, parent_category_id, category_path, display_order) VALUES
('Walk-in claimant request/ Claimants Request for Assistance',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Claims'),
 '/Claims/Walk-in claimant request/ Claimants Request for Assistance', 1),
('Claims filed directly to CRLD through email',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Claims'),
 '/Claims/Claims filed directly to CRLD through email', 2),
('Court-related cases',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Claims'),
 '/Claims/Court-related cases', 3);

-- Sub folders for Bank/Financial Statements
INSERT INTO document_categories (category_name, parent_category_id, category_path, display_order) VALUES
('Monthly Statements',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Bank/Financial Statements'),
 '/Bank/Financial Statements/Monthly Statements', 1),
('Bank Statements',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Bank/Financial Statements'),
 '/Bank/Financial Statements/Bank Statements', 2);

-- Sub folders for Division Files
INSERT INTO document_categories (category_name, parent_category_id, category_path, display_order) VALUES
('Appointment Papers',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Division Files'),
 '/Division Files/Appointment Papers', 1),
('Minutes of Meeting',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Division Files'),
 '/Division Files/Minutes of Meeting', 2),
('Administrative Matters',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Division Files'),
 '/Division Files/Administrative Matters', 3),
('Other important documents',
 (SELECT category_id FROM (SELECT * FROM document_categories) AS temp WHERE category_name = 'Division Files'),
 '/Division Files/Other important documents', 4);


 -- Create default admin user (password: admin123 - should be changed)
INSERT INTO users (username, email, password_hash, full_name, role, can_view, can_edit, can_upload, can_delete, can_print)
VALUES ('admin', 'admin@crl.com', 'scrypt:32768:8:1$qDxZ4rMjfGaKhLAP$e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
'System Administrator', 'admin', TRUE, TRUE, TRUE, TRUE, TRUE);


