import axios from '@/services/AxiosCustomize';

export const getNotificationsAPI = async () => {
	const res = await axios.get('/notifications');

	return res.data as IModelPaginate<INotification[]>;
};

export const readNotificationAPI = async (id: string) => {
	const res = await axios.post(`/notifications/read/${id}`);

	return res.data as IBackendRes<INotification>;
};
