REVOKE ALL ON TABLE public.match_decision_history FROM PUBLIC, anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public.match_decision_history FROM authenticated;
GRANT SELECT ON TABLE public.match_decision_history TO authenticated;