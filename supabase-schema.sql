-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stickers table
CREATE TABLE IF NOT EXISTS public.stickers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  qr_code_data TEXT, -- Base64 encoded QR code
  sticker_image_url TEXT, -- URL to the generated sticker image
  theme TEXT DEFAULT 'default',
  style_preferences JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sticker_analytics table for tracking scans
CREATE TABLE IF NOT EXISTS public.sticker_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sticker_id UUID REFERENCES public.stickers(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  location_data JSONB
);

-- Row Level Security Policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Stickers policies
CREATE POLICY "Users can view own stickers" ON public.stickers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public stickers" ON public.stickers
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create own stickers" ON public.stickers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stickers" ON public.stickers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stickers" ON public.stickers
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Users can view own sticker analytics" ON public.sticker_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stickers 
      WHERE stickers.id = sticker_analytics.sticker_id 
      AND stickers.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert analytics" ON public.sticker_analytics
  FOR INSERT WITH CHECK (true);

-- Functions and triggers

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stickers_updated_at
  BEFORE UPDATE ON public.stickers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stickers_user_id ON public.stickers(user_id);
CREATE INDEX IF NOT EXISTS idx_stickers_public ON public.stickers(is_public);
CREATE INDEX IF NOT EXISTS idx_sticker_analytics_sticker_id ON public.sticker_analytics(sticker_id);
CREATE INDEX IF NOT EXISTS idx_sticker_analytics_scanned_at ON public.sticker_analytics(scanned_at);
