-- Create profiles table for owner info
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Syed Maroof Hussain',
  title TEXT NOT NULL DEFAULT 'BTech Student | Cloud Computing & AI',
  bio TEXT DEFAULT 'First-year BTech student specializing in Computer Science with Cloud Computing and AI at Integral University, Lucknow.',
  email TEXT DEFAULT 'syedmaroofhussain3@gmail.com',
  phone TEXT DEFAULT '+91 7275570844',
  instagram TEXT DEFAULT 'syed_maroof19',
  github TEXT DEFAULT 'prof-syedmaroofhussain3-blip',
  linkedin TEXT,
  location TEXT DEFAULT 'Lucknow, Uttar Pradesh, India',
  dob DATE DEFAULT '2006-03-19',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  preview_url TEXT,
  github_url TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER DEFAULT 50,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experience table
CREATE TABLE public.experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  credential_url TEXT,
  credential_id TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotes table for Solo Leveling quotes
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  character_name TEXT DEFAULT 'Sung Jin-Woo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (portfolio is public)
CREATE POLICY "Public can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public can view education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public can view experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Public can view certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view quotes" ON public.quotes FOR SELECT USING (true);

-- Admin (authenticated user) full access
CREATE POLICY "Admin can manage profiles" ON public.profiles FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage projects" ON public.projects FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage skills" ON public.skills FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage education" ON public.education FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage experience" ON public.experience FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage certifications" ON public.certifications FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage blog posts" ON public.blog_posts FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage quotes" ON public.quotes FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Insert initial data
INSERT INTO public.quotes (quote, character_name) VALUES
('I alone level up.', 'Sung Jin-Woo'),
('The difference between the novice and the master is that the master has failed more times than the novice has tried.', 'Sung Jin-Woo'),
('I will become strong enough to protect everyone.', 'Sung Jin-Woo'),
('The weak can never forgive. Forgiveness is the attribute of the strong.', 'Sung Jin-Woo'),
('Every trial endured and weathered in the right spirit makes a soul nobler and stronger.', 'System'),
('Rise from the ashes.', 'Sung Jin-Woo'),
('Only those who are willing to suffer greatly can achieve great things.', 'System'),
('The true hunter moves in silence.', 'Sung Jin-Woo');

INSERT INTO public.projects (title, description, tech_stack, preview_url, is_featured, display_order) VALUES
('SoloRank', 'A ranking system built completely using AI prompts, inspired by Solo Leveling theme.', ARRAY['AI', 'Prompt Engineering'], NULL, true, 1),
('Quest Star Rise', 'Habit tracking app based on Solo Leveling anime theme. Level up by completing daily quests!', ARRAY['React', 'TypeScript', 'Tailwind CSS'], 'https://quest-star-rise.lovable.app', true, 2);

INSERT INTO public.skills (name, category, proficiency, display_order) VALUES
('Java', 'Programming Languages', 75, 1),
('HTML/CSS', 'Web Development', 60, 2),
('JavaScript', 'Web Development', 50, 3),
('React', 'Frameworks', 40, 4),
('TypeScript', 'Programming Languages', 35, 5),
('Cloud Computing', 'Specialization', 30, 6),
('AI/ML', 'Specialization', 25, 7);

INSERT INTO public.education (institution, degree, field, location, start_date, is_current, description, display_order) VALUES
('Integral University', 'BTech', 'Computer Science with Cloud Computing and AI', 'Kursi Road, Lucknow, UP', '2024-08-01', true, 'First-year student specializing in Cloud Computing and Artificial Intelligence.', 1),
('Christ Church College', 'ISC (Class 12)', 'PCM with Computer Science', 'Hazratganj, GPO, Lucknow, UP', '2022-04-01', false, 'Completed schooling with focus on Physics, Chemistry, Mathematics and Computer Science.', 2);

INSERT INTO public.profiles (full_name, title, bio) VALUES
('Syed Maroof Hussain', 'BTech Student | Cloud Computing & AI', 'First-year BTech student at Integral University, Lucknow, specializing in Computer Science with Cloud Computing and AI. Passionate about web development and currently pursuing a Web Development course on Udemy. Born on March 19, 2006, in Lucknow, UP.');

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();