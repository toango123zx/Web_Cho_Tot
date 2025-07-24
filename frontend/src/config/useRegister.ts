import { useMutation } from '@tanstack/react-query';
import { registerAPI } from '@/services/api/auth';

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
