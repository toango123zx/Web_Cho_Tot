import axios from '@/services/AxiosCustomize';

export const getUsersAPI = () => {
	return axios.get<IBackendRes<IModelPaginate<IUserTable>>>('/api/users');
};

export const getUsersPaginateAPI = (page: number, limit: number) => {
	return axios.get('/users', {
		params: { _page: page, _limit: limit },
	});
};

export const createUserAPI = (payload: IUser) => {
	return axios.post('/users', payload);
};

export const deleteUserAPI = (id: number) => {
	return axios.delete(`/users/${id}`);
};

export const updateUserAPI = ({ id, ...rest }: IUserUpdatePayload) => {
	return axios.put(`/users/${id}`, rest);
};

export const getOnlineUsersAPI = () => {
	return axios.get<IBackendRes<IOnlineUser>>('/users/online');
};
