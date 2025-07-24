import { useMutation } from '@tanstack/react-query';
import { loginAPI } from '@/services/api/auth';

export const useLogin = () => {
	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) =>
			loginAPI(email, password),
	});
};
