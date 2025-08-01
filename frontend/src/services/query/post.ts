import { QUERY_KEY } from '@/config/key';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createPostAPI, getCategoriesAPI, getPostsAPI } from '../api/post';

export const usePosts = (page: number, limit: number) => {
	return useQuery<IModelPaginate<IPost[]> | null, Error>({
		queryKey: QUERY_KEY.getPosts({ page, limit }),
		queryFn: async () => {
			const res = await getPostsAPI({ page, limit });
			return res.success ? res : null;
		},
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
	});
};

export const useCategories = () => {
	return useQuery<ICategory[] | null, Error>({
		queryKey: QUERY_KEY.getCategories(),
		queryFn: async () => {
			const res = await getCategoriesAPI();
			return res.success ? res.data : null;
		},
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
	});
};

export const useCreatePost = () => {
	return useMutation({
		mutationFn: (payload: ICreatePostPayload) => createPostAPI(payload),
	});
};
