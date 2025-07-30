import axios from '@/services/AxiosCustomize';

export const getUsersAPI = async () => {
	const res = await axios.get('/users', {
		withCredentials: true,
	});

	return res.data as IModelPaginate<IUser[]>;
};

export const getUsersPaginateAPI = async (page: number, limit: number) => {
	const res = await axios.get('/users', {
		params: { page, limit },
		withCredentials: true,
	});

	return res.data as IModelPaginate<IUser[]>;
};

export const createUserAPI = (payload: IUserCreation) => {
	return axios.post('/users', payload);
};

export const deleteUserAPI = (id: string) => {
	return axios.delete(`/users/${id}`);
};

export const updateUserAPI = (id: string, payload: IUserUpdatePayload) => {
	return axios.patch(`/users/${id}`, payload);
};

export const getOnlineUsersAPI = () => {
	return axios.get<IBackendRes<IOnlineUser>>('/users/online');
	return axios.get<IBackendRes<IOnlineUser>>('/users/online');
};
