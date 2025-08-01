import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchAccountAPI, loginAPI, registerAPI } from '../api/auth';
import { QUERY_KEY } from '@/config/key';
// import axios from '@/services/AxiosCustomize';
import { isAxiosError } from 'axios';

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
	return useQuery<IFetchAccount | null, Error, IFetchAccount | null, string[]>({
		queryKey: QUERY_KEY.getAccount(),
		queryFn: async () => {
			try {
				const res = await fetchAccountAPI();
				return res.success ? res.data : null;
			} catch (err: any) {
				if (isAxiosError(err) && err.response?.status === 401) {
					return null;
				}
				throw err;
			}
		},
		staleTime: 1000 * 60 * 5,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};
