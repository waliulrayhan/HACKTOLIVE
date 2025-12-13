-- Manual Migration: Remove Duplicate Fields from Student Table
-- Date: 2025-12-14
-- Description: Remove duplicate fields (name, email, phone, avatar) from Student table
--              as these fields already exist in the User table via the userId relation

-- Drop the index on email first
DROP INDEX `Student_email_key` ON `Student`;

-- Remove duplicate columns from Student table
ALTER TABLE `Student`
  DROP COLUMN `name`,
  DROP COLUMN `email`,
  DROP COLUMN `avatar`,
  DROP COLUMN `phone`;

-- Note: The Student table will now only have:
-- - id (primary key)
-- - userId (foreign key to User table)
-- - enrolledCourses, completedCourses, certificatesEarned (stats fields)
-- - createdAt, updatedAt (timestamps)
-- All user info (name, email, phone, avatar) will be accessed via the User relation
