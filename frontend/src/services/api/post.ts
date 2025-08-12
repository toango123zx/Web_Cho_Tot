export const fetchArchivedPostsAPI = async (params?: PostQueryParams) => {
	const res = await axios.get('/posts/archive', { params });
	return res.data as IModelPaginate<IPostWithCategoryAndUser[]>;
};
import axios from '@/services/AxiosCustomize';

interface PostQueryParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: IPostStatus;
	categoryId?: string;
	minPrice?: number;
	maxPrice?: number;
	age?: string;
	size?: string;
	address?: string;
	district?: string;
	province?: string;
	sortBy?: 'createdAt' | 'price' | 'title';
	sortOrder?: 'asc' | 'desc';
}

export const postApi = {
	getPosts: async (params?: PostQueryParams) => {
		const res = await axios.get('/posts', { params });

		return res.data as IModelPaginate<IPostWithCategoryAndUser[]>;
	},

	updatePostStatus: async (postId: string, status: IPostStatus) => {
		const res = await axios.patch(`/posts/${postId}/status`, { status });

		return res.data as IBackendRes<IPostWithCategoryAndUser>;
	},

	acceptPost: async (postId: string) => {
		const res = await axios.patch(`/posts/${postId}/accept`);

		return res.data as IBackendRes<IPost>;
	},
};

export const createPostAPI = async (payload: ICreatePostPayload) => {
	const res = await axios.post('/posts', payload);
	return res.data as IBackendRes<IPostWithCategoryAndUser>;
};

export const fetchPostByIdAPI = async (id: string) => {
	const res = await axios.get(`/posts/${id}`);
	return res.data as IBackendRes<IPostWithCategoryAndUser>;
};

export const fetchPostsByUserId = async (userId: string) => {
	const res = await axios.get(`/posts/user/${userId}`);
	return res.data as IBackendRes<IPostWithCategoryAndUser[]>;
};

export const deletePostAPI = async (postId: string) => {
	const res = await axios.delete(`/posts/${postId}`);
	return res.data as IBackendRes<IPost>;
};

export const updatePostByIdAPI = async (
	postId: string,
	payload: Partial<IUpdatePostPayload>,
) => {
	const res = await axios.patch(`/posts/${postId}`, payload);
	return res.data as IBackendRes<IPostWithCategoryAndUser>;
};

export const toggleArchivePostAPI = async (postId: string) => {
	const res = await axios.post(`/posts/${postId}/toggle-archive`);
	return res.data as IBackendRes<IPostWithCategoryAndUser>;
};
