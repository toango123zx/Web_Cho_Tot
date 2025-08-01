import { PostStatusTabs } from '@/components/commons/admin';
import { PostCard } from '@/components/commons/admin/PostCard';
import { Button } from '@/components/ui/button';
import { QUERY_KEY } from '@/config/key';
import { usePostMutations, usePostQueryWithPagination } from '@/services/query/post';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

type IPostStatus = 'ALL' | 'PENDING' | 'PUBLISHED' | 'EXPIRED' | 'DELETED';
const ITEMS_PER_PAGE = 10;

const PostCardSkeleton = () => (
	<div className="h-[300px] rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse">
		<div className="h-40 bg-gray-200 rounded-t-lg" />
		<div className="p-4 space-y-3">
			<div className="h-4 bg-gray-200 rounded w-3/4" />
			<div className="h-4 bg-gray-200 rounded w-1/2" />
			<div className="h-4 bg-gray-200 rounded w-1/4" />
		</div>
	</div>
);

export default function PostManagement() {
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState<IPostStatus>('PENDING');
	const [isAcceptingPostId, setIsAcceptingPostId] = useState<string>();

	const queryClient = useQueryClient();
	const { data: postResponse, isFetching: loading } = usePostQueryWithPagination({
		page,
		limit: ITEMS_PER_PAGE,
		status: status === 'ALL' ? undefined : status,
	});
	const { acceptPost } = usePostMutations();

	const handleApprove = async (postId: string) => {
		setIsAcceptingPostId(postId);
		acceptPost.mutate(
			{ postId },
			{
				onSuccess: (res) => {
					if (res.success) {
						toast.success('Bài đăng đã được duyệt');
						queryClient.invalidateQueries({ queryKey: QUERY_KEY.getAllPost() });
					} else {
						toast.error(res.message || 'Lỗi khi duyệt bài đăng');
					}
				},
				onError: (error: any) => {
					toast.error(error?.response?.data?.message || 'Lỗi khi duyệt bài đăng');
				},
				onSettled: () => {
					setIsAcceptingPostId(undefined);
				},
			},
		);
	};

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Quản lý bài đăng</h1>

			<PostStatusTabs
				status={status}
				onChange={(s) => {
					setStatus(s as IPostStatus);
					setPage(1);
				}}
			/>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
				{loading ? (
					<>
						{Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
							<PostCardSkeleton key={index} />
						))}
					</>
				) : !postResponse?.success ? (
					<div className="col-span-3 text-center text-red-500">
						{postResponse?.message || 'Không có dữ liệu bài đăng'}
					</div>
				) : postResponse.data.length === 0 ? (
					<div className="col-span-3 text-center text-gray-500">
						Không có bài đăng nào
					</div>
				) : (
					postResponse.data.map((post) => (
						<PostCard
							key={post.id}
							post={post}
							onApprove={handleApprove}
							isApproving={acceptPost.isPending}
							isApprovingPostId={isAcceptingPostId}
						/>
					))
				)}
			</div>

			{!loading && postResponse?.success && postResponse.data.length > 0 && (
				<div className="flex justify-center gap-2 pt-6">
					<Button
						variant="outline"
						disabled={page <= 1}
						onClick={() => setPage((p) => p - 1)}
					>
						Trang trước
					</Button>
					<span className="text-sm text-muted-foreground">
						Trang {postResponse.pagination.currentPage} /{' '}
						{postResponse.pagination.totalPages}
					</span>
					<Button
						variant="outline"
						disabled={
							postResponse.pagination.currentPage >= postResponse.pagination.totalPages
						}
						onClick={() => setPage((p) => p + 1)}
					>
						Trang sau
					</Button>
				</div>
			)}
		</div>
	);
}
