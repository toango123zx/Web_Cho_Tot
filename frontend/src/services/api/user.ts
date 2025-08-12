import axios from '@/services/AxiosCustomize';

export const getUsersAPI = async () => {
	const res = await axios.get('/users', {
		withCredentials: true,
	});

	return res.data as IModelPaginate<IUser[]>;
};

export const getUsersPaginateAPI = async (
	page: number,
	limit: number,
	search?: string,
) => {
	const res = await axios.get('/users', {
		params: { page, limit, search },
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

export const changePasswordAPI = async (data: {
	currentPassword: string;
	newPassword: string;
}) => {
	const res = await axios.post('/users/change-password', data);
	return res.data as IBackendRes<IChangePassword>;
};
