import axios from '@/services/AxiosCustomize';
import { sleep } from '../sleep';

export const loginAPI = async (email: string, password: string) => {
	await sleep(3000);
	return axios.post<IBackendRes<ILogin>>('/auth/login', { email, password });
};

export const registerAPI = async (name: string, email: string, password: string) => {
	return axios.post<IBackendRes<IRegister>>('/auth/register', {
		name,
		email,
		password,
	});
};

export const fetchAccountAPI = async () => {
	await sleep(1500);
	return axios.get<IBackendRes<IFetchAccount>>('/users/me', { withCredentials: true });
};
