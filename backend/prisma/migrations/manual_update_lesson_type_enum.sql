-- Manual Migration: Update LessonType enum to remove QUIZ and ASSIGNMENT
-- Date: 2025-12-14
-- Description: Remove QUIZ and ASSIGNMENT from LessonType enum since they are separate relations

-- Step 1: Update any existing lessons with type QUIZ or ASSIGNMENT to VIDEO
-- (assuming these should be VIDEO lessons with quizzes/assignments attached)
UPDATE `Lesson` 
SET `type` = 'VIDEO' 
WHERE `type` IN ('QUIZ', 'ASSIGNMENT');

-- Step 2: Modify the Lesson table to use the new enum
-- Note: This requires dropping and recreating the enum, which MySQL handles differently
-- In MySQL, we need to use ALTER TABLE MODIFY COLUMN

-- First, let's ensure any existing lessons use valid types
-- Then modify the column to use only VIDEO and ARTICLE
ALTER TABLE `Lesson` 
MODIFY COLUMN `type` ENUM('VIDEO', 'ARTICLE') NOT NULL;

-- Verification query (run this to check the changes):
-- SELECT DISTINCT `type` FROM `Lesson`;
