import { useState } from 'react';

export function useLoading(initialLoading = false) {
	const [loading, setLoading] = useState(initialLoading);

	const execute = async (fn: () => Promise<void>) => {
		try {
			setLoading(true);
			await fn();
		} finally {
			setLoading(false);
		}
	};

	return { loading, execute };
}
