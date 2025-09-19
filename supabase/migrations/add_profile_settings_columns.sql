-- Add settings columns to profiles table for Allumi
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS fingerprint_api_key TEXT,
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS weekly_reports BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS name TEXT;

-- Add index for faster profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Update RLS policies to allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;