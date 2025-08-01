import axios from '@/services/AxiosCustomize';

export const getPostsAPI = async () => {
	const res = await axios.get('/posts');
	return res.data as IBackendRes<IPost[]>;
};
