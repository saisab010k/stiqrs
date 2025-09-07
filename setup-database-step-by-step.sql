-- Step 1: Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 4: Create stickers table
CREATE TABLE IF NOT EXISTS public.stickers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  qr_code_data TEXT,
  sticker_image_url TEXT,
  theme TEXT DEFAULT 'default',
  style_preferences JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Enable RLS on stickers
ALTER TABLE public.stickers ENABLE ROW LEVEL SECURITY;

-- Step 6: Create stickers policies
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

-- Step 7: Create analytics table
CREATE TABLE IF NOT EXISTS public.sticker_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sticker_id UUID REFERENCES public.stickers(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  location_data JSONB
);

-- Step 8: Enable RLS on analytics
ALTER TABLE public.sticker_analytics ENABLE ROW LEVEL SECURITY;

-- Step 9: Create analytics policies
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

-- Step 10: Create function for new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
