export const QUERY_KEY = {
	getAllUser: () => ['fetchUser'],
	getUserPaginate: (page: number) => {
		return ['fetchUser', page];
	},
	getAccount: () => ['account'],
	getAllPost: () => ['posts'],
	list: (params?: Record<string, any>) =>
		[...QUERY_KEY.getAllPost(), 'list', params] as const,
	getAllCategories: () => ['categories'],
	getCategoryPaginate: (page: number) => {
		return ['categories', page];
	},
};
