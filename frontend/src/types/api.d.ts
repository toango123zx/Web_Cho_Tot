interface IBackendRes<T> {
	message?: string;
	data?: T;
	success: boolean;
}

interface IModelPaginate<T> {
	meta: {
		current: number;
		pageSize: number;
		pages: number;
		total: number;
	};
	result: T[];
}
