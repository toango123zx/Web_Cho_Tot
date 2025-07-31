export const QUERY_KEY = {
	getAllUser: () => ['fetchUser'],
	getUserPaginate: (page: number) => {
		return ['fetchUser', page];
	},
	getAccount: () => ['account'],
	getAllCategories: () => ['categories'],
	getCategoryPaginate: (page: number) => {
		return ['categories', page];
	},
};
