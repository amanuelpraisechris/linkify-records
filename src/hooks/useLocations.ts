import { useQuery, useQueryClient } from '@tanstack/react-query';
import { locationsService } from '@/services/locationsService';

export const useLocations = () => {
  const qc = useQueryClient();
  const areas = useQuery({ queryKey: ['admin_areas'], queryFn: locationsService.listAreas });
  const facilities = useQuery({ queryKey: ['health_facilities'], queryFn: locationsService.listFacilities });
  const admin = useQuery({ queryKey: ['is_admin'], queryFn: locationsService.isAdmin });
  return {
    areas: areas.data || [],
    facilities: facilities.data || [],
    isAdmin: !!admin.data,
    loading: areas.isLoading || facilities.isLoading,
    refresh: () => {
      qc.invalidateQueries({ queryKey: ['admin_areas'] });
      qc.invalidateQueries({ queryKey: ['health_facilities'] });
    },
  };
};
