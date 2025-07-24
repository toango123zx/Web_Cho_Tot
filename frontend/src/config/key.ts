export const QUERY_KEY = {
	getAllUser: () => ['fetchUser'],
	getUserPaginate: (page: number) => {
		return ['fetchUser', page];
	},
	getAccount: () => ['account'],
};
