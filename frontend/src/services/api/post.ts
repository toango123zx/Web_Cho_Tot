import axios from '@/services/AxiosCustomize';

interface PostQueryParams {
	page?: number;
	limit?: number;
	search?: string;
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
