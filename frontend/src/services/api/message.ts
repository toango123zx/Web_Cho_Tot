import axios from '@/services/AxiosCustomize';

export const getMessagesAPI = (receiverId: string) => {
	return axios.get<IBackendRes<IMessage[]>>(`/messages/${receiverId}`);
};

export const getChatUsersAPI = () => {
	return axios.get<IBackendRes<IUser[]>>('/messages/users');
};
