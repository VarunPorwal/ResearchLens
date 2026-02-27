-- 1. Create a table for user profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create a table for research papers
CREATE TABLE public.papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  title TEXT,
  abstract TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for papers
CREATE POLICY "Users can view their own papers" ON public.papers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own papers" ON public.papers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own papers" ON public.papers
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Storage Setup (Run these as SQL if possible or create manually in Dashboard)
-- Insert bucket into storage.buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('pdfs', 'pdfs', false);

-- Set up storage policies
CREATE POLICY "authenticated users can upload pdfs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pdfs' AND auth.role() = 'authenticated');

CREATE POLICY "users can view their own pdfs" ON storage.objects
  FOR SELECT USING (bucket_id = 'pdfs' AND auth.role() = 'authenticated');
