CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'news',
  title text NOT NULL,
  excerpt text,
  body text,
  image_url text,
  link_url text,
  published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads published articles" ON public.articles FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admins manage articles" ON public.articles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.successes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL DEFAULT 2026,
  image_url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.successes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.successes TO authenticated;
GRANT ALL ON public.successes TO service_role;
ALTER TABLE public.successes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads successes" ON public.successes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage successes" ON public.successes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.program_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_key text NOT NULL,
  season text NOT NULL DEFAULT 'winter',
  subject text NOT NULL,
  hours numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.program_hours TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.program_hours TO authenticated;
GRANT ALL ON public.program_hours TO service_role;
ALTER TABLE public.program_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads program hours" ON public.program_hours FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage program hours" ON public.program_hours FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public reads site media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'site-media');
CREATE POLICY "admins upload site media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update site media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete site media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.program_hours (class_key, season, subject, hours, sort_order) VALUES
('a','summer','Νεοελληνική Γλώσσα',2,1),
('a','summer','Αρχαία Ελληνικά',2,2),
('a','summer','Ιστορία',1,3),
('a','winter','Νεοελληνική Γλώσσα',2,1),
('a','winter','Αρχαία Ελληνικά',2,2),
('a','winter','Ιστορία',1,3),
('a','winter','Λογοτεχνία',1,4),
('b','summer','Νεοελληνική Γλώσσα',2,1),
('b','summer','Αρχαία Ελληνικά',3,2),
('b','summer','Ιστορία',2,3),
('b','summer','Λατινικά',2,4),
('b','winter','Νεοελληνική Γλώσσα',2,1),
('b','winter','Αρχαία Ελληνικά',3,2),
('b','winter','Ιστορία',2,3),
('b','winter','Λατινικά',2,4),
('g','summer','Νεοελληνική Γλώσσα',3,1),
('g','summer','Αρχαία Ελληνικά',4,2),
('g','summer','Ιστορία',3,3),
('g','summer','Λατινικά',3,4),
('g','winter','Νεοελληνική Γλώσσα',3,1),
('g','winter','Αρχαία Ελληνικά',4,2),
('g','winter','Ιστορία',3,3),
('g','winter','Λατινικά',3,4);