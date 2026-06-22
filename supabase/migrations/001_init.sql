-- CVio Supabase Database Init Schema

-- 1. Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  plan TEXT DEFAULT 'free', -- 'free' | 'pro' | 'annual'
  plan_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow users to update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. CVs Table
CREATE TABLE public.cvs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  target_company TEXT,
  data JSONB NOT NULL,
  template TEXT DEFAULT 'modern',
  is_public BOOLEAN DEFAULT FALSE,
  link_expires_at TIMESTAMPTZ,
  pdf_url TEXT,
  pdf_expires_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for CVs
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their CVs" ON public.cvs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public CVs are viewable" ON public.cvs
  FOR SELECT USING (is_public = true);

-- 3. CV views logs table
CREATE TABLE public.cv_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cv_id UUID REFERENCES public.cvs(id) ON DELETE CASCADE NOT NULL,
  viewer_ip TEXT,
  viewer_country TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for CV views
ALTER TABLE public.cv_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert views" ON public.cv_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "CV owners can read views" ON public.cv_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cvs
      WHERE public.cvs.id = cv_views.cv_id AND public.cvs.user_id = auth.uid()
    )
  );

-- 4. Stripe Subscriptions Table
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT,
  status TEXT, -- 'active' | 'canceled' | 'past_due'
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription status" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- 5. Database RPC function to increment views
CREATE OR REPLACE FUNCTION public.increment_view_count(cv_row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.cvs
  SET view_count = view_count + 1
  WHERE id = cv_row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, plan)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
