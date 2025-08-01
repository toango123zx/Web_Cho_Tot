export const QUERY_KEY = {
	getAllUser: () => ['fetchUser'],
	getUserPaginate: (page: number) => {
		return ['fetchUser', page];
	},
	getAccount: () => ['account'],
	getPosts: (params: { page: number; limit: number }) => ['posts', params],
	getCategories: () => ['categories'],
};
