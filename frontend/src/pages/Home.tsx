import { useEffect, useState } from 'react';
import { Heart, MapPin, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePosts, useToggleArchivePost, useArchivedPosts } from '@/services/query/post';
import { getRelativeTime } from '@/helper';
import { useNavigate } from 'react-router-dom';
import { useCurrentApp } from '@/components/context/AppContext';

import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/config/key';

const LIMIT = 9;

export default function HomePage() {
	const { isAuthenticated } = useCurrentApp();
	const [page, setPage] = useState(1);
	const [postList, setPostList] = useState<IPost[]>([]);
	const navigate = useNavigate();
	const [isLoadMore, setIsLoadMore] = useState(false);

	const queryClient = useQueryClient();
	const toggleArchiveMutation = useToggleArchivePost();

	const { data: archivedData } = useArchivedPosts({ page: 1, limit: 100 });
	const archivedIds =
		archivedData && archivedData.success && Array.isArray(archivedData.data)
			? (archivedData.data as { id: string }[]).map((p) => p.id)
			: [];

	const { data, isLoading } = usePosts(page, LIMIT, 'PUBLISHED');

	useEffect(() => {
		if (data?.success && data.data.length > 0) {
			setPostList((prev) => [...prev, ...data.data]);
		}
		if (isLoadMore) setIsLoadMore(false);
	}, [data]);

	const handleLoadMore = () => {
		setIsLoadMore(true);

		setTimeout(() => {
			setPage((prev) => prev + 1);
		}, 600);
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Navigation Tabs */}
			<div className="bg-white border-b">
				<div className="max-w-6xl mx-auto px-6">
					<div className="flex space-x-8">
						<button className="py-4 px-2 border-b-2 border-orange-500 text-orange-500 font-medium cursor-pointer">
							Dành cho bạn
						</button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
				{isLoading && postList.length === 0 ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{Array.from({ length: 9 }).map((_, idx) => (
							<div key={idx} className="animate-pulse bg-white rounded-md shadow p-2">
								<div className="bg-gray-200 h-40 sm:h-48 w-full rounded-md mb-2" />
								<div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
								<div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
								<div className="h-3 bg-gray-100 rounded w-1/3" />
							</div>
						))}
					</div>
				) : postList.length === 0 ? (
					<p>Không có sản phẩm nào</p>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{postList.map((post: IPost) => (
							<div
								key={post.id}
								className="cursor-pointer group"
								onClick={() => navigate(`/post/${post.id}`)}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === 'Enter') navigate(`/post/${post.id}`);
								}}
							>
								<div className="relative group overflow-hidden">
									<img
										src={post.postImages[0]?.url || '/placeholder.svg'}
										alt={post.title}
										className="w-full h-40 sm:h-48 object-cover transition-transform duration-200 group-hover:scale-105 rounded-md z-0"
									/>
									<Button
										variant="ghost"
										size="icon"
										className={`absolute top-2 right-2 h-8 w-8 rounded-full border-0 z-10 ${archivedIds.includes(post.id) ? 'bg-red-500 hover:bg-red-600' : 'bg-black/20 hover:bg-black/40'}`}
										onClick={(e) => {
											e.stopPropagation();
											if (!isAuthenticated) {
												navigate('/login');
												return;
											}
											toggleArchiveMutation.mutate(post.id, {
												onSuccess: (res) => {
													if (res.success) {
														queryClient.invalidateQueries({
															queryKey: QUERY_KEY.getArchivedPosts({
																page: 1,
																limit: 100,
															}),
														});
														toast.success('Cập nhật trạng thái lưu trữ thành công!');
													} else {
														toast.error(res.message || 'Cập nhật thất bại');
													}
												},
												onError: (err) => {
													const error: any = err;
													toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
												},
											});
										}}
									>
										<Heart
											className={`h-4 w-4 ${archivedIds.includes(post.id) ? 'text-white' : 'text-white'}`}
										/>
									</Button>
									<div className="absolute bottom-0 left-0 right-0 flex justify-between items-end bg-gradient-to-t from-black/70 to-transparent px-2 py-1 rounded-b-md z-10 pointer-events-none transition-transform duration-200 group-hover:scale-105">
										<span className="text-white text-xs font-semibold">
											{getRelativeTime(post.createdAt)}
										</span>
										<span className="flex items-center gap-1 text-white text-xs font-semibold">
											{post.postImages.length}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path d="M4 3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4zm0 2h12v10H4V5zm2 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-1 7 2.5-3 2.5 3h-5zm6 0 2-2.5 2 2.5h-4z" />
											</svg>
										</span>
									</div>
								</div>
								<div className="pt-2">
									<h3 className="font-normal text-sm line-clamp-2 mb-1 text-black leading-tight">
										{post.title}
									</h3>
									<div className="flex items-center justify-between mb-1">
										<span className="font-bold text-red-600 text-sm">
											{post.price.toLocaleString()} đ
										</span>
										<Button variant="ghost" size="icon" className="h-5 w-5 p-0">
											<MoreHorizontal className="h-4 w-4 text-gray-400" />
										</Button>
									</div>
									<div className="flex items-center text-xs text-gray-500">
										<MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
										<span className="truncate">{post.address}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Load More */}
				{data?.success && postList.length % LIMIT === 0 && postList.length !== 0 && (
					<div className="text-center mt-8">
						<Button
							onClick={handleLoadMore}
							variant="outline"
							className="px-8 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
							disabled={isLoading || isLoadMore}
						>
							{(isLoading && postList.length === 0) || isLoadMore
								? 'Đang tải...'
								: 'Xem thêm'}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
