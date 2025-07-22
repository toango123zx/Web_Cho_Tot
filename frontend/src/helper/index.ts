export const calculatePagesCount = (pageSize: number, totalCount: number) => {
	if (pageSize <= 0) {
		throw new Error('Page size must be greater than 0');
	}
	if (totalCount < 0) {
		throw new Error('Total count cannot be negative');
	}
	return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
};

export const trimData = <T>(data: Record<string, unknown>, removeEmpty = true) => {
	const result: Record<string, unknown> = {};

	Object.entries(data).forEach(([key, value]) => {
		if (removeEmpty && !!result[key]) {
			return;
		}

		if (typeof value !== 'string') {
			result[key] = value;
		} else {
			result[key] = value.trim();
		}
	});

	return result as T;
};
