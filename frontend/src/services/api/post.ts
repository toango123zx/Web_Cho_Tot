import axios from '@/services/AxiosCustomize';

export const getPostsAPI = async (params: { page: number; limit: number }) => {
	const res = await axios.get('/posts', { params });
	return res.data as IModelPaginate<IPost[]>;
};

export const getCategoriesAPI = async () => {
	const res = await axios.get('/categories');
	return res.data as IBackendRes<ICategory[]>;
};

export const createPostAPI = async (payload: ICreatePostPayload) => {
	const res = await axios.post('/posts', payload);
	return res.data as IBackendRes<ICreatePostPayload>;
};
