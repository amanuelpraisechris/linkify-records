CREATE TABLE public.match_decision_history (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 match_result_id uuid NOT NULL,
 source_id text NOT NULL,
 candidate_id text,
 decision text NOT NULL,
 reason text,
 user_id uuid NOT NULL,
 collector_name text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.match_decision_history TO authenticated;
GRANT ALL ON public.match_decision_history TO service_role;
ALTER TABLE public.match_decision_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Collectors can read their own decision history" ON public.match_decision_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX match_decision_history_user_source_time ON public.match_decision_history(user_id, source_id, created_at DESC);
CREATE OR REPLACE FUNCTION public.record_match_decision_history() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE actor_id uuid; actor_name text;
BEGIN
 IF NEW.status NOT IN ('matched','rejected','manual-review') THEN RETURN NEW; END IF;
 IF TG_OP = 'UPDATE' THEN
   IF (NEW.status, NEW.match_id, NEW.notes) IS NOT DISTINCT FROM (OLD.status, OLD.match_id, OLD.notes) THEN RETURN NEW; END IF;
 END IF;
 actor_id := COALESCE(auth.uid(), NEW.user_id);
 IF actor_id IS NULL THEN RAISE EXCEPTION 'A collector is required to record a match decision'; END IF;
 SELECT COALESCE(NULLIF(trim(full_name),''), NULLIF(trim(username),'')) INTO actor_name FROM public.profiles WHERE id = actor_id;
 INSERT INTO public.match_decision_history(match_result_id,source_id,candidate_id,decision,reason,user_id,collector_name)
 VALUES (NEW.id,NEW.source_id,NEW.match_id,CASE NEW.status WHEN 'matched' THEN 'confirmed' WHEN 'rejected' THEN 'no-match' ELSE 'review' END,NULLIF(trim(NEW.notes),''),actor_id,COALESCE(actor_name,actor_id::text));
 RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.record_match_decision_history() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER capture_match_decision_history AFTER INSERT OR UPDATE ON public.match_results FOR EACH ROW EXECUTE FUNCTION public.record_match_decision_history();