CREATE TABLE IF NOT EXISTS public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  title text not null,
  description text,
  body text,
  link_url text,
  link_label text,
  image_url text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.page_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_sections TO authenticated;
GRANT ALL ON public.page_sections TO service_role;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "page_sections public read" ON public.page_sections;
CREATE POLICY "page_sections public read" ON public.page_sections FOR SELECT USING (published = true);
DROP POLICY IF EXISTS "page_sections admin manage" ON public.page_sections;
CREATE POLICY "page_sections admin manage" ON public.page_sections FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));