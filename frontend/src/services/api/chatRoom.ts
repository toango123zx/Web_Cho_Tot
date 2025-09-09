import axios from '@/services/AxiosCustomize';

export const getChatRoomsAPI = async (page: number, limit: number, search?: string) => {
	const res = await axios.get('/chat-rooms', {
		params: {
			page: page,
			limit: limit,
			search: search,
		},
		withCredentials: true,
	});

	return res.data as IModelPaginate<IChatRoom[]>;
};

export const getChatRoomByChatRoomIdAPI = async (
	chatRoomId: string,
	page: number,
	limit: number,
) => {
	const res = await axios.get(`/chat-rooms/${chatRoomId}`, {
		params: {
			page: page,
			limit: limit,
		},
		withCredentials: true,
	});

	return res.data as IBackendRes<IChatRoom>;
};

export const createChatRoomAPI = async (userId: string) => {
	const res = await axios.post(`/chat-rooms`, { userId }, { withCredentials: true });

	return res.data as IBackendRes<IChatRoom>;
};
