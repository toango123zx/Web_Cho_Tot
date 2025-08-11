export const QUERY_KEY = {
	getAllUser: () => ['fetchUser'],
	getUserPaginate: (page: number, search: string) => {
		return ['fetchUser', page, search];
	},
	getAccount: () => ['account'],
	getAllPost: () => ['posts'],
	list: (params?: Record<string, any>) => [...QUERY_KEY.getAllPost(), 'list', params],
	getAllCategories: () => ['categories'],
	getCategoryInfinite: (params?: Record<string, any>) =>
		['categories', 'infinite', params] as const,
	getCategoryPaginate: (page: number, search?: string) => {
		return ['categories', page, search || ''];
	},
	getPosts: (params: { page: number; limit: number; status?: IPostStatus }) => [
		'posts',
		params,
	],
	getPostById: (id: string) => ['post', id],
	getPostsByUserId: (userId: string) => ['posts', 'user', userId],
	getArchivedPosts: (params?: Record<string, any>) => ['archived-posts', params],
	getNotifications: () => ['notifications'],
};
