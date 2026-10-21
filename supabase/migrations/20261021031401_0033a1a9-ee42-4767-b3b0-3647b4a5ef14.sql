DO $$ BEGIN CREATE TYPE public.app_role AS ENUM ('admin','user'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE TABLE IF NOT EXISTS public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, role public.app_role NOT NULL, UNIQUE(user_id, role));
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role) $$;

CREATE TABLE public.health_facilities (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, name_ti text, facility_type text NOT NULL DEFAULT 'Health Center', woreda text, status text NOT NULL DEFAULT 'pending', created_by uuid, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.health_facilities TO authenticated;
GRANT ALL ON public.health_facilities TO service_role;
ALTER TABLE public.health_facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in read facilities" ON public.health_facilities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Collectors propose facilities" ON public.health_facilities FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND (status = 'pending' OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "Admins update facilities" ON public.health_facilities FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete facilities" ON public.health_facilities FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.admin_areas (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), level text NOT NULL, parent_id uuid REFERENCES public.admin_areas(id) ON DELETE CASCADE, name_en text NOT NULL, name_ti text, status text NOT NULL DEFAULT 'pending', created_by uuid, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_areas TO authenticated;
GRANT ALL ON public.admin_areas TO service_role;
ALTER TABLE public.admin_areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in read areas" ON public.admin_areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Collectors propose areas" ON public.admin_areas FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND (status = 'pending' OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "Admins update areas" ON public.admin_areas FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete areas" ON public.admin_areas FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_hf_updated BEFORE UPDATE ON public.health_facilities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_aa_updated BEFORE UPDATE ON public.admin_areas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.health_facilities (name, facility_type, woreda, status) VALUES
('Wukro General Hospital','Hospital','Kilte Awlaelo','active'),
('Wukro Health Center','Health Center','Kilte Awlaelo','active'),
('Agulae Health Center','Health Center','Kilte Awlaelo','active'),
('Abraha Atsbeha Health Center','Health Center','Kilte Awlaelo','active');
WITH w AS (INSERT INTO public.admin_areas (level, name_en, name_ti, status) VALUES ('woreda','Kilte Awlaelo','ክልተ ኣውላዕሎ','active') RETURNING id)
INSERT INTO public.admin_areas (level, parent_id, name_en, status) SELECT 'tabia', w.id, t, 'active' FROM w, unnest(ARRAY['Abraha Atsbeha','Agulae','Genfel','Aynalem','Mahbere Selam','Tsaeda Ambora','Negash','Debre Selam','Wukro Town']) t;

ALTER TABLE public.clinic_records ADD COLUMN IF NOT EXISTS woreda text, ADD COLUMN IF NOT EXISTS tabia text, ADD COLUMN IF NOT EXISTS kushet text, ADD COLUMN IF NOT EXISTS house_number text, ADD COLUMN IF NOT EXISTS father_name text, ADD COLUMN IF NOT EXISTS grandfather_name text, ADD COLUMN IF NOT EXISTS mother_name text, ADD COLUMN IF NOT EXISTS visit_type text, ADD COLUMN IF NOT EXISTS mother_record_id text;
ALTER TABLE public.community_records ADD COLUMN IF NOT EXISTS woreda text, ADD COLUMN IF NOT EXISTS tabia text, ADD COLUMN IF NOT EXISTS kushet text, ADD COLUMN IF NOT EXISTS house_number text, ADD COLUMN IF NOT EXISTS father_name text, ADD COLUMN IF NOT EXISTS grandfather_name text, ADD COLUMN IF NOT EXISTS visit_type text, ADD COLUMN IF NOT EXISTS mother_record_id text;
UPDATE public.clinic_records SET tabia = village, kushet = sub_village WHERE tabia IS NULL AND village IS NOT NULL;
UPDATE public.community_records SET tabia = village, kushet = sub_village WHERE tabia IS NULL AND village IS NOT NULL;