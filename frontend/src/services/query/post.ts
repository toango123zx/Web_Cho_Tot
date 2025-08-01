import { QUERY_KEY } from '@/config/key';
import { useMutation, useQuery } from '@tanstack/react-query';
import { postApi } from '../api/post';

export const usePostQueryWithPagination = (params?: {
	page?: number;
	limit?: number;
	search?: string;
	status?: IPostStatus;
}) => {
	return useQuery({
		queryKey: QUERY_KEY.list(params),
		queryFn: () => postApi.getPosts(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
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
