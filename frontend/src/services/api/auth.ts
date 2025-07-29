import axios from '@/services/AxiosCustomize';
import { sleep } from '../sleep';

export const loginAPI = async (email: string, password: string) => {
	await sleep(1500);
	const res = await axios.post('/auth/login', { email, password });

	return res.data as IBackendRes<ILogin>;
};

export const registerAPI = async (name: string, email: string, password: string) => {
	const res = await axios.post('/auth/register', {
		name,
		email,
		password,
	});

	return res.data as IBackendRes<IRegister>;
};

export const fetchAccountAPI = async () => {
	await sleep(1500);
	const res = await axios.get('/users/me');

	return res.data as IBackendRes<IFetchAccount>;
};
