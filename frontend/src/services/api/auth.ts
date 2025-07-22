import axios from '@/services/AxiosCustomize';

export const loginAPI = async (username: string, password: string) => {
	// return axios.post<IBackendRes<ILogin>>('/auth/login', {
	// 	email: 'admin@example.com',
	// 	password: '11aaBB**',
	// });
	return axios.post<IBackendRes<ILogin>>('/auth/login', {
		email: 'admin1@gmail.com',
		password: 'Admin@123',
	});
};

export const registerAPI = async (name: string, email: string, password: string) => {
	return axios.post<IBackendRes<IRegister>>('/auth/register', {
		name,
		email,
		password,
	});
};
