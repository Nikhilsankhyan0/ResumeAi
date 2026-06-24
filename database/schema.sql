-- =====================================================
--  ResumeAI — MySQL Database Schema
--  Run: mysql -u root -p < database/schema.sql
-- =====================================================
CREATE DATABASE IF NOT EXISTS resumeai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE resumeai_db;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  title         VARCHAR(120) DEFAULT NULL,
  location      VARCHAR(120) DEFAULT NULL,
  website       VARCHAR(255) DEFAULT NULL,
  bio           TEXT         DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Resumes
CREATE TABLE IF NOT EXISTS resumes (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_name   VARCHAR(255) NOT NULL,
  file_size     INT UNSIGNED NOT NULL,
  mime_type     VARCHAR(100) NOT NULL,
  uploaded_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_resumes_user (user_id),
  CONSTRAINT fk_resumes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analyses (one-to-one with resumes)
CREATE TABLE IF NOT EXISTS analyses (
  id            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  resume_id     INT UNSIGNED     NOT NULL,
  ats_score     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  skills        JSON             DEFAULT NULL,
  gaps          JSON             DEFAULT NULL,
  insights      JSON             DEFAULT NULL,
  created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_analyses_resume (resume_id),
  CONSTRAINT fk_analyses_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Saved jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
  id         INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED     NOT NULL,
  job_id     VARCHAR(100)     NOT NULL,
  title      VARCHAR(255)     DEFAULT NULL,
  company    VARCHAR(120)     DEFAULT NULL,
  location   VARCHAR(120)     DEFAULT NULL,
  job_type   VARCHAR(60)      DEFAULT NULL,
  salary     VARCHAR(60)      DEFAULT NULL,
  match_pct  TINYINT UNSIGNED DEFAULT NULL,
  saved_at   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_saved_job (user_id, job_id),
  CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Demo user (password: password123)
INSERT IGNORE INTO users (id, name, email, password_hash, title, location)
VALUES (1,'Demo User','demo@resumeai.app',
  '$2a$12$K8GpMoiLuOJHNJFQxWJtxeQpCi4a5p4HPxdmOAK.YT/wjGk4oU9mS',
  'Frontend Engineer','San Francisco, CA');
