import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchAccountAPI, loginAPI, registerAPI } from '../api/auth';
import { QUERY_KEY } from '@/config/key';

export const useLogin = () => {
	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) =>
			loginAPI(email, password),
	});
};

export const useRegister = () => {
	return useMutation({
		mutationFn: ({
			name,
			email,
			password,
		}: {
			name: string;
			email: string;
			password: string;
		}) => registerAPI(name, email, password),
	});
};

export const useAccount = () => {
	return useQuery({
		queryKey: QUERY_KEY.getAccount(),
		queryFn: async () => {
			const res = await fetchAccountAPI();
			return res.success ? res.data : null;
		},
		// enabled: !!localStorage.getItem('access_token'),
		staleTime: 1000 * 60 * 5,
		retry: false,
		refetchOnWindowFocus: false,
	});
};
