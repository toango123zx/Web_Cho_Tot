import { useQuery } from '@tanstack/react-query';
import { fetchAccountAPI } from '@/services/api/auth';

export const useAccount = () => {
	return useQuery({
		queryKey: ['account'],
		queryFn: async () => {
			const res = await fetchAccountAPI();
			return res.data.data;
		},
		enabled: !!localStorage.getItem('access_token'),
		staleTime: 1000 * 60 * 5,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};
