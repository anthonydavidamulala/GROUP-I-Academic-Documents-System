-- MySQL 8.0+ recommended. Re-running this file preserves existing requests.
CREATE DATABASE IF NOT EXISTS academic_document_system
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE academic_document_system;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS document_requests (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  student_number VARCHAR(50) NOT NULL,
  student_name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL,
  document_type VARCHAR(50) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending',
  date_requested TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_student_number (student_number),
  CONSTRAINT chk_document_type CHECK (document_type IN (
    'Academic Transcript', 'Result Slip', 'Completion Letter', 'Academic Verification Letter'
  )),
  CONSTRAINT chk_status CHECK (status IN ('Pending', 'Under Review', 'Ready', 'Rejected'))
);
