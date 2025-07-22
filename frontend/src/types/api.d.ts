type IBackendRes<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			message: string;
	  };

type IModelPaginate<T> =
	| {
			success: true;
			data: T;
			pagination: {
				totalItems: number;
				itemsPerPage: number;
				currentPage: number;
				totalPages: number;
			};
	  }
	| {
			success: false;
			message: string;
	  };
