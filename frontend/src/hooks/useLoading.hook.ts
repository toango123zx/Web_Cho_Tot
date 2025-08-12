import { useState } from 'react';

export function useLoading() {
	const [loading, setLoading] = useState(false);

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
