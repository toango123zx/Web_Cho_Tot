import { useState, useEffect } from 'react';

const RECENT_SEARCHES_KEY = 'cho-tot-recent-searches';
const MAX_RECENT_SEARCHES = 10;

export interface RecentSearch {
	id: string;
	query: string;
	province?: string;
	timestamp: number;
}

export const useRecentSearches = () => {
	const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

	// Load recent searches from localStorage on mount
	useEffect(() => {
		try {
			const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
			if (saved) {
				const parsed = JSON.parse(saved) as RecentSearch[];
				// Sort by timestamp (most recent first) and ensure valid data
				const validSearches = parsed
					.filter((search) => search.query && search.timestamp)
					.sort((a, b) => b.timestamp - a.timestamp)
					.slice(0, MAX_RECENT_SEARCHES);
				setRecentSearches(validSearches);
			}
		} catch (error) {
			console.error('Failed to load recent searches:', error);
			localStorage.removeItem(RECENT_SEARCHES_KEY);
		}
	}, []);

	// Save recent searches to localStorage
	const saveToLocalStorage = (searches: RecentSearch[]) => {
		try {
			localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
		} catch (error) {
			console.error('Failed to save recent searches:', error);
		}
	};

	// Add a new search to recent searches
	const addRecentSearch = (query: string, province?: string) => {
		const trimmedQuery = query.trim();
		if (!trimmedQuery) return;

		setRecentSearches((prev) => {
			// Remove existing search with same query and province
			const filtered = prev.filter(
				(search) =>
					!(
						search.query.toLowerCase() === trimmedQuery.toLowerCase() &&
						search.province === province
					),
			);

			// Create new search entry
			const newSearch: RecentSearch = {
				id: Date.now().toString(),
				query: trimmedQuery,
				province,
				timestamp: Date.now(),
			};

			// Add to beginning and limit to MAX_RECENT_SEARCHES
			const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);
			saveToLocalStorage(updated);
			return updated;
		});
	};

	// Remove a specific search from recent searches
	const removeRecentSearch = (id: string) => {
		setRecentSearches((prev) => {
			const updated = prev.filter((search) => search.id !== id);
			saveToLocalStorage(updated);
			return updated;
		});
	};

	// Clear all recent searches
	const clearRecentSearches = () => {
		setRecentSearches([]);
		localStorage.removeItem(RECENT_SEARCHES_KEY);
	};

	// Get filtered recent searches based on current input
	const getFilteredRecentSearches = (currentQuery: string) => {
		if (!currentQuery.trim()) return recentSearches;

		const query = currentQuery.toLowerCase();
		return recentSearches.filter((search) => search.query.toLowerCase().includes(query));
	};

	return {
		recentSearches,
		addRecentSearch,
		removeRecentSearch,
		clearRecentSearches,
		getFilteredRecentSearches,
	};
};
