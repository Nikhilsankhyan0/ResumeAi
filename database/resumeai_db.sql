-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 24, 2026 at 12:29 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `resumeai_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `analyses`
--

CREATE TABLE `analyses` (
  `id` int(10) UNSIGNED NOT NULL,
  `resume_id` int(10) UNSIGNED NOT NULL,
  `ats_score` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `gaps` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gaps`)),
  `insights` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`insights`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `analyses`
--

INSERT INTO `analyses` (`id`, `resume_id`, `ats_score`, `skills`, `gaps`, `insights`, `created_at`) VALUES
(1, 1, 72, '[\"python\",\"pandas\",\"numpy\",\"matplotlib\",\"sql\",\"tableau\",\"power bi\",\"ms excel\",\"excel\",\"data analysis\",\"data analytics\",\"data cleaning\",\"etl\",\"reporting\",\"dashboards\",\"statistical analysis\",\"php\",\"team management\",\"leadership\",\"presentation\"]', '[\"data visualization\",\"statistics\",\"kpi\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 72 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding data visualization, statistics, kpi could boost your match rate by +18%.\"},{\"type\":\"positive\",\"text\":\"Strong keyword coverage — your resume is well optimised.\"}]', '2026-06-21 09:32:16'),
(2, 2, 72, '[\"python\",\"pandas\",\"numpy\",\"matplotlib\",\"sql\",\"tableau\",\"power bi\",\"ms excel\",\"excel\",\"data analysis\",\"data analytics\",\"data cleaning\",\"etl\",\"reporting\",\"dashboards\",\"statistical analysis\",\"php\",\"team management\",\"leadership\",\"presentation\"]', '[\"data visualization\",\"statistics\",\"kpi\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 72 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding data visualization, statistics, kpi could boost your match rate by +18%.\"},{\"type\":\"positive\",\"text\":\"Strong keyword coverage — your resume is well optimised.\"}]', '2026-06-21 09:32:16'),
(3, 3, 55, '[\"ms excel\",\"excel\",\"google sheets\",\"data analysis\",\"data cleaning\",\"reporting\"]', '[\"sql\",\"python\",\"data visualization\",\"tableau\",\"power bi\",\"etl\",\"statistics\",\"kpi\",\"dashboards\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 55 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding sql, python, data visualization could boost your match rate by +18%.\"}]', '2026-06-21 09:35:17'),
(4, 5, 57, '[\"ms excel\",\"excel\",\"google sheets\",\"data analysis\",\"data cleaning\",\"reporting\"]', '[\"data analytics\",\"sql\",\"python\",\"data visualization\",\"tableau\",\"power bi\",\"etl\",\"statistics\",\"kpi\",\"dashboards\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 57 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding data analytics, sql, python could boost your match rate by +18%.\"}]', '2026-06-21 09:37:11'),
(5, 4, 57, '[\"ms excel\",\"excel\",\"google sheets\",\"data analysis\",\"data cleaning\",\"reporting\"]', '[\"data analytics\",\"sql\",\"python\",\"data visualization\",\"tableau\",\"power bi\",\"etl\",\"statistics\",\"kpi\",\"dashboards\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 57 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding data analytics, sql, python could boost your match rate by +18%.\"}]', '2026-06-21 09:37:11'),
(6, 6, 57, '[\"ms excel\",\"excel\",\"google sheets\",\"data analysis\",\"data cleaning\",\"reporting\"]', '[\"data analytics\",\"sql\",\"python\",\"data visualization\",\"tableau\",\"power bi\",\"etl\",\"statistics\",\"kpi\",\"dashboards\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 57 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding data analytics, sql, python could boost your match rate by +18%.\"}]', '2026-06-21 09:37:14'),
(7, 7, 69, '[\"python\",\"postgresql\",\"redis\",\"javascript\",\"typescript\",\"react\",\"node.js\",\"express\",\"next.js\",\"java\",\"go\",\"spring\",\"django\",\"flask\",\"fastapi\",\"graphql\",\"microservices\",\"docker\",\"kubernetes\",\"aws\",\"gcp\",\"ci/cd\",\"github\",\"terraform\",\"jenkins\"]', '[\"rest api\",\"agile\",\"html\",\"css\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 69 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding rest api, agile, html could boost your match rate by +18%.\"},{\"type\":\"positive\",\"text\":\"Strong keyword coverage — your resume is well optimised.\"}]', '2026-06-21 09:38:27'),
(8, 8, 55, '[\"ms excel\",\"excel\",\"google sheets\",\"data analysis\",\"data cleaning\",\"reporting\"]', '[\"sql\",\"python\",\"data visualization\",\"tableau\",\"power bi\",\"etl\",\"statistics\",\"kpi\",\"dashboards\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 55 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding sql, python, data visualization could boost your match rate by +18%.\"}]', '2026-06-24 15:06:08'),
(9, 9, 55, '[\"ms excel\",\"excel\",\"google sheets\",\"data analysis\",\"data cleaning\",\"reporting\"]', '[\"sql\",\"python\",\"data visualization\",\"tableau\",\"power bi\",\"etl\",\"statistics\",\"kpi\",\"dashboards\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 55 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding sql, python, data visualization could boost your match rate by +18%.\"}]', '2026-06-24 15:06:08'),
(10, 11, 70, '[\"python\",\"pandas\",\"numpy\",\"matplotlib\",\"sql\",\"tableau\",\"power bi\",\"ms excel\",\"excel\",\"data analysis\",\"data analytics\",\"data cleaning\",\"etl\",\"reporting\",\"dashboards\",\"statistical analysis\",\"php\",\"team management\",\"leadership\",\"presentation\"]', '[\"statistics\",\"data visualization\",\"kpi\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 70 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding statistics, data visualization, kpi could boost your match rate by +18%.\"},{\"type\":\"positive\",\"text\":\"Strong keyword coverage — your resume is well optimised.\"}]', '2026-06-24 15:20:35'),
(11, 10, 70, '[\"python\",\"pandas\",\"numpy\",\"matplotlib\",\"sql\",\"tableau\",\"power bi\",\"ms excel\",\"excel\",\"data analysis\",\"data analytics\",\"data cleaning\",\"etl\",\"reporting\",\"dashboards\",\"statistical analysis\",\"php\",\"team management\",\"leadership\",\"presentation\"]', '[\"statistics\",\"data visualization\",\"kpi\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 70 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding statistics, data visualization, kpi could boost your match rate by +18%.\"},{\"type\":\"positive\",\"text\":\"Strong keyword coverage — your resume is well optimised.\"}]', '2026-06-24 15:20:35'),
(12, 12, 70, '[\"python\",\"pandas\",\"numpy\",\"matplotlib\",\"sql\",\"tableau\",\"power bi\",\"ms excel\",\"excel\",\"data analysis\",\"data analytics\",\"data cleaning\",\"etl\",\"reporting\",\"dashboards\",\"statistical analysis\",\"php\",\"team management\",\"leadership\",\"presentation\"]', '[\"statistics\",\"data visualization\",\"kpi\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 70 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding statistics, data visualization, kpi could boost your match rate by +18%.\"},{\"type\":\"positive\",\"text\":\"Strong keyword coverage — your resume is well optimised.\"}]', '2026-06-24 15:20:35'),
(13, 13, 72, '[\"python\",\"pandas\",\"numpy\",\"matplotlib\",\"sql\",\"tableau\",\"power bi\",\"ms excel\",\"excel\",\"data analysis\",\"data analytics\",\"data cleaning\",\"etl\",\"reporting\",\"dashboards\",\"statistical analysis\",\"php\",\"team management\",\"leadership\",\"presentation\"]', '[\"data visualization\",\"statistics\",\"kpi\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 72 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding data visualization, statistics, kpi could boost your match rate by +18%.\"},{\"type\":\"positive\",\"text\":\"Strong keyword coverage — your resume is well optimised.\"}]', '2026-06-24 15:20:50'),
(14, 14, 72, '[\"python\",\"pandas\",\"numpy\",\"matplotlib\",\"sql\",\"tableau\",\"power bi\",\"ms excel\",\"excel\",\"data analysis\",\"data analytics\",\"data cleaning\",\"etl\",\"reporting\",\"dashboards\",\"statistical analysis\",\"php\",\"team management\",\"leadership\",\"presentation\"]', '[\"data visualization\",\"statistics\",\"kpi\"]', '[{\"type\":\"suggestion\",\"text\":\"ATS score of 72 is good. Small tweaks can push it higher.\"},{\"type\":\"suggestion\",\"text\":\"Adding data visualization, statistics, kpi could boost your match rate by +18%.\"},{\"type\":\"positive\",\"text\":\"Strong keyword coverage — your resume is well optimised.\"}]', '2026-06-24 15:20:52');

-- --------------------------------------------------------

--
-- Table structure for table `resumes`
--

CREATE TABLE `resumes` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `stored_name` varchar(255) NOT NULL,
  `file_size` int(10) UNSIGNED NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `uploaded_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `resumes`
--

INSERT INTO `resumes` (`id`, `user_id`, `original_name`, `stored_name`, `file_size`, `mime_type`, `uploaded_at`) VALUES
(1, 2, 'nikhil Data Analyst.pdf', '2_1782014532029_nikhil_Data_Analyst.pdf', 365160, 'application/pdf', '2026-06-21 09:32:12'),
(2, 2, 'nikhil Data Analyst.pdf', '2_1782014534709_nikhil_Data_Analyst.pdf', 365160, 'application/pdf', '2026-06-21 09:32:14'),
(3, 2, 'ABHISHEK.pdf', '2_1782014716734_ABHISHEK.pdf', 80115, 'application/pdf', '2026-06-21 09:35:16'),
(4, 2, 'ABHISHEK.pdf', '2_1782014813080_ABHISHEK.pdf', 80115, 'application/pdf', '2026-06-21 09:36:53'),
(5, 2, 'ABHISHEK.pdf', '2_1782014814359_ABHISHEK.pdf', 80115, 'application/pdf', '2026-06-21 09:36:54'),
(6, 2, 'ABHISHEK.pdf', '2_1782014830855_ABHISHEK.pdf', 80115, 'application/pdf', '2026-06-21 09:37:10'),
(7, 2, 'karan_resume.pdf', '2_1782014906146_karan_resume.pdf', 34445, 'application/pdf', '2026-06-21 09:38:26'),
(8, 3, 'ABHISHEK.pdf', '3_1782293763678_ABHISHEK.pdf', 80115, 'application/pdf', '2026-06-24 15:06:03'),
(9, 3, 'ABHISHEK.pdf', '3_1782293765369_ABHISHEK.pdf', 80115, 'application/pdf', '2026-06-24 15:06:05'),
(10, 3, 'nikhil Data Analyst.pdf', '3_1782294598821_nikhil_Data_Analyst.pdf', 365160, 'application/pdf', '2026-06-24 15:19:59'),
(11, 3, 'nikhil Data Analyst.pdf', '3_1782294603784_nikhil_Data_Analyst.pdf', 365160, 'application/pdf', '2026-06-24 15:20:03'),
(12, 3, 'nikhil Data Analyst.pdf', '3_1782294617544_nikhil_Data_Analyst.pdf', 365160, 'application/pdf', '2026-06-24 15:20:17'),
(13, 3, 'nikhil Data Analyst.pdf', '3_1782294648853_nikhil_Data_Analyst.pdf', 365160, 'application/pdf', '2026-06-24 15:20:48'),
(14, 3, 'nikhil Data Analyst.pdf', '3_1782294650330_nikhil_Data_Analyst.pdf', 365160, 'application/pdf', '2026-06-24 15:20:50');

-- --------------------------------------------------------

--
-- Table structure for table `saved_jobs`
--

CREATE TABLE `saved_jobs` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `job_id` varchar(100) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `company` varchar(120) DEFAULT NULL,
  `location` varchar(120) DEFAULT NULL,
  `job_type` varchar(60) DEFAULT NULL,
  `salary` varchar(60) DEFAULT NULL,
  `match_pct` tinyint(3) UNSIGNED DEFAULT NULL,
  `saved_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `title` varchar(120) DEFAULT NULL,
  `location` varchar(120) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `title`, `location`, `website`, `bio`, `created_at`, `updated_at`) VALUES
(1, 'Demo User', 'demo@resumeai.app', '$2a$12$K8GpMoiLuOJHNJFQxWJtxeQpCi4a5p4HPxdmOAK.YT/wjGk4oU9mS', 'Frontend Engineer', 'San Francisco, CA', NULL, NULL, '2026-06-21 09:19:51', NULL),
(2, 'Nikhil Sankhyan', 'sankhyannikhil0@gmail.com', '$2a$12$8pUbXd26tWBV5JABQE3NNeo0GaNm4lLbM35FJYDfpT.ciXl/5OfsG', NULL, NULL, NULL, NULL, '2026-06-21 09:31:47', NULL),
(3, 'Nikhil Sankhyan', 'sankhyannikhil01@gmail.com', '$2a$12$leQbjGpTI5XOXmR9TV1uUuWBPbQkEa1Gy7N8gxcAn924HDdsJ8jCK', NULL, NULL, NULL, NULL, '2026-06-24 15:05:53', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `analyses`
--
ALTER TABLE `analyses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_analyses_resume` (`resume_id`);

--
-- Indexes for table `resumes`
--
ALTER TABLE `resumes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_resumes_user` (`user_id`);

--
-- Indexes for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_saved_job` (`user_id`,`job_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `analyses`
--
ALTER TABLE `analyses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `resumes`
--
ALTER TABLE `resumes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `analyses`
--
ALTER TABLE `analyses`
  ADD CONSTRAINT `fk_analyses_resume` FOREIGN KEY (`resume_id`) REFERENCES `resumes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `resumes`
--
ALTER TABLE `resumes`
  ADD CONSTRAINT `fk_resumes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD CONSTRAINT `fk_saved_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
