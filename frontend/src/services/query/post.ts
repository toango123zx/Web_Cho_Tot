import { fetchArchivedPostsAPI } from '../api/post';

import { updatePostByIdAPI } from '../api/post';

import { deletePostAPI, fetchPostsByUserId } from './../api/post';
import { QUERY_KEY } from '@/config/key';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { createPostAPI, fetchPostByIdAPI, postApi } from '../api/post';
import { toggleArchivePostAPI } from '../api/post';
import { trimData } from '@/helper';

interface UseInfinitePostParams {
	limit?: number;
	search?: string;
	status?: IPostStatus;
	categoryId?: string;
	minPrice?: number;
	maxPrice?: number;
	age?: string;
	size?: string;
	address?: string;
	district?: string;
	province?: string;
	sortBy?: 'createdAt' | 'price' | 'title';
	sortOrder?: 'asc' | 'desc';
}

export const usePostQueryWithPagination = (params?: {
	page?: number;
	limit?: number;
	search?: string;
	status?: IPostStatus;
	categoryId?: string;
	minPrice?: number;
	maxPrice?: number;
	age?: string;
	size?: string;
	address?: string;
	district?: string;
	province?: string;
	sortBy?: 'createdAt' | 'price' | 'title';
	sortOrder?: 'asc' | 'desc';
}) => {
	const trimmedParams = trimData<typeof params>(params as Record<string, unknown>);
	const query = useQuery({
		queryKey: QUERY_KEY.list(params),
		queryFn: () => postApi.getPosts(trimmedParams),
		staleTime: 1000 * 60 * 5, // Reduce stale time to prevent caching issues
	});
	return query;
};

export const useInfinitePostQuery = (params: UseInfinitePostParams = {}) => {
	const {
		limit = 20,
		search,
		status,
		categoryId,
		minPrice,
		maxPrice,
		age,
		size,
		address,
		district,
		province,
		sortBy,
		sortOrder,
	} = params;

	const filters = trimData<typeof params>({
		search,
		status,
		categoryId,
		minPrice,
		maxPrice,
		age,
		size,
		address,
		district,
		province,
		sortBy,
		sortOrder,
	});

	return useInfiniteQuery({
		queryKey: [QUERY_KEY.list(), filters],
		staleTime: 1000 * 60 * 5,
		queryFn: ({ pageParam = 1 }) =>
			postApi.getPosts({ ...filters, page: pageParam, limit }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (!lastPage.success) return undefined;
			const { pagination } = lastPage;

			return pagination.currentPage < pagination.totalPages
				? pagination.currentPage + 1
				: undefined;
		},
	});
};

export const usePostMutations = () => {
	const updatePostStatus = useMutation({
		mutationFn: ({ postId, status }: { postId: string; status: IPostStatus }) =>
			postApi.updatePostStatus(postId, status),
	});

	const acceptPost = useMutation({
		mutationFn: ({ postId }: { postId: string }) => postApi.acceptPost(postId),
	});

	return { updatePostStatus, acceptPost };
};

export const usePosts = (page: number, limit: number, status?: IPostStatus) => {
	return useQuery<IModelPaginate<IPostWithCategoryAndUser[]> | null, Error>({
		queryKey: QUERY_KEY.getPosts({ page, limit, status }),
		queryFn: async () => {
			const res = await postApi.getPosts({ page, limit, status });
			return res.success ? res : null;
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

export const usePostById = (id: string) => {
	return useQuery({
		queryKey: QUERY_KEY.getPostById(id),
		queryFn: async () => {
			const res = await fetchPostByIdAPI(id);
			return res.success ? res.data : null;
		},
		enabled: !!id,
		staleTime: 1000 * 60 * 5,
		retry: 1,
		refetchOnWindowFocus: false,
	});
};

export const usePostsByUserId = (userId: string) => {
	return useQuery({
		queryKey: QUERY_KEY.getPostsByUserId(userId),
		queryFn: async () => {
			const res = await fetchPostsByUserId(userId);
			return res.success ? res.data : null;
		},
		enabled: !!userId,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
	});
};

export const useDeletePost = () => {
	return useMutation({
		mutationFn: (postId: string) => deletePostAPI(postId),
	});
};

export const useUpdatePostById = () => {
	return useMutation({
		mutationFn: ({
			postId,
			payload,
		}: {
			postId: string;
			payload: Partial<IUpdatePostPayload>;
		}) => updatePostByIdAPI(postId, payload),
	});
};

export const useToggleArchivePost = () => {
	return useMutation({
		mutationFn: (postId: string) => toggleArchivePostAPI(postId),
	});
};

export const useArchivedPosts = (params?: { page?: number; limit?: number }) => {
	return useQuery({
		queryKey: QUERY_KEY.getArchivedPosts(params),
		queryFn: () => fetchArchivedPostsAPI(params),
		staleTime: 1000 * 60 * 5,
	});
};
