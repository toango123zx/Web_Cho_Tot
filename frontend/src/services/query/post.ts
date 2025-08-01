import { QUERY_KEY } from '@/config/key';
import { useQuery } from '@tanstack/react-query';
import { getPostsAPI } from '../api/post';

export const usePosts = () => {
	return useQuery<IPost[] | null, Error>({
		queryKey: QUERY_KEY.getPosts(),
		queryFn: async () => {
			const res = await getPostsAPI();
			return res.success ? res.data : null;
		},
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
	});
};
