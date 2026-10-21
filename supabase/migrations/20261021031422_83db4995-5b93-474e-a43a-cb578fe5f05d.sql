REVOKE ALL ON public.health_facilities, public.admin_areas, public.user_roles FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;