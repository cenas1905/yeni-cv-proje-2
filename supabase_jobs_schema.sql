-- CVio AI Job Matcher & Employer Database Schema

-- 1. İş Arayan Kullanıcıların Tercihleri
CREATE TABLE IF NOT EXISTS job_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_cities TEXT[] DEFAULT '{}', -- Örn: ['İstanbul', 'Ankara']
  work_types TEXT[] DEFAULT '{}', -- Örn: ['Remote', 'Hybrid', 'Office']
  expected_salary_min INTEGER DEFAULT 0,
  job_titles TEXT[] DEFAULT '{}', -- Örn: ['Frontend Developer', 'UI/UX Designer']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- 2. İşveren İlanları (Platforma doğrudan verilen ilanlar)
CREATE TABLE IF NOT EXISTS employer_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  job_title TEXT NOT NULL,
  location TEXT NOT NULL,
  work_type TEXT NOT NULL, -- Remote, Office, Hybrid
  salary_range TEXT,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Kullanıcıların İş Başvuruları
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES employer_jobs(id) ON DELETE CASCADE,
  applicant_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending', -- pending, reviewed, rejected, accepted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Row Level Security (RLS) Policies
ALTER TABLE job_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi tercihlerini görebilir ve düzenleyebilir
CREATE POLICY "Users can view own preferences" ON job_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON job_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON job_preferences FOR UPDATE USING (auth.uid() = user_id);

-- İlanları herkes görebilir (Giriş yapmış)
CREATE POLICY "Anyone can view active jobs" ON employer_jobs FOR SELECT USING (is_active = TRUE);

-- Sadece işverenler kendi ilanlarını yönetebilir
CREATE POLICY "Employers can insert jobs" ON employer_jobs FOR INSERT WITH CHECK (auth.uid() = employer_user_id);
CREATE POLICY "Employers can update own jobs" ON employer_jobs FOR UPDATE USING (auth.uid() = employer_user_id);

-- Kullanıcılar kendi başvurularını görebilir
CREATE POLICY "Users can view own applications" ON job_applications FOR SELECT USING (auth.uid() = applicant_user_id);
-- İşverenler kendi ilanlarına yapılan başvuruları görebilir
CREATE POLICY "Employers can view applications for their jobs" ON job_applications FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM employer_jobs WHERE id = job_applications.job_id AND employer_user_id = auth.uid()
  )
);
-- Kullanıcılar başvuru yapabilir
CREATE POLICY "Users can insert applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = applicant_user_id);
