-- ================================================
-- FIX FOREIGN KEY CONSTRAINTS
-- ================================================
-- Run this in Supabase SQL Editor to fix the foreign key issues
-- that are preventing settings and campaign spend from working

-- Drop existing incorrect constraints if they exist
ALTER TABLE IF EXISTS user_settings
DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;

ALTER TABLE IF EXISTS campaign_spend
DROP CONSTRAINT IF EXISTS campaign_spend_user_id_fkey;

-- Add correct foreign key constraints pointing to auth.users
ALTER TABLE user_settings
ADD CONSTRAINT user_settings_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE campaign_spend
ADD CONSTRAINT campaign_spend_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Verify the constraints were updated
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN ('user_settings', 'campaign_spend');