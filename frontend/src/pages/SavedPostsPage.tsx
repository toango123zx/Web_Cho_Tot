import { useState } from 'react';
import { getRelativeTime } from '@/helper';

import { useArchivedPosts, useToggleArchivePost } from '@/services/query/post';
import { Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function SavedPostsPage() {
	const { data, isLoading } = useArchivedPosts({ page: 1, limit: 100 });
	const toggleArchiveMutation = useToggleArchivePost();
	const posts = data && data.success && Array.isArray(data.data) ? data.data : [];
	const [unarchivedIds, setUnarchivedIds] = useState<string[]>([]);

	return (
		<div className="min-h-screen bg-gray-100 py-8 px-4 md:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
				{/* Main Heading */}
				<h1 className="text-xl font-bold mb-6">Tin đăng đã lưu ({posts.length} / 100)</h1>

				{/* List of Saved Items */}
				<div className="space-y-4">
					{isLoading ? (
						Array.from({ length: 3 }).map((_, idx) => (
							<div
								key={idx}
								className="flex items-center border-b border-gray-200 pb-4 last:border-b-0 animate-pulse"
							>
								<div className="relative w-24 h-24 flex-shrink-0 mr-4 rounded-lg overflow-hidden bg-gray-200" />
								<div className="flex-grow">
									<div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
									<div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
									<div className="h-3 bg-gray-100 rounded w-1/2" />
								</div>
								<div className="flex items-center space-x-2 ml-4">
									<div className="h-8 w-16 bg-gray-200 rounded" />
									<div className="h-8 w-8 bg-gray-200 rounded-full" />
								</div>
							</div>
						))
					) : posts.length === 0 ? (
						<div className="text-center text-gray-500 py-8">Chưa có tin nào được lưu</div>
					) : (
						posts.map((post: any) => (
							<div
								key={post.id}
								className="flex items-center border-b border-gray-200 pb-4 last:border-b-0"
							>
								<div className="relative w-24 h-24 flex-shrink-0 mr-4 rounded-lg overflow-hidden">
									<img
										src={
											post.postImages?.[0]?.url || '/placeholder.svg?height=96&width=96'
										}
										alt={post.title}
										width={96}
										height={96}
										className="object-cover w-full h-full"
									/>
									{post.postImages?.length > 1 && (
										<div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
											{post.postImages.length}
										</div>
									)}
								</div>
								<div className="flex-grow">
									<h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
										{post.title}
									</h2>
									<p className="text-red-600 font-bold text-lg mt-1">
										{post.price?.toLocaleString?.() || post.price} đ
									</p>
									<div className="flex items-center text-sm text-gray-500 mt-2">
										{post.user?.avatar ? (
											<img
												src={post.user.avatar}
												alt={post.user.name || 'avatar'}
												className="w-5 h-5 rounded-full mr-1 object-cover border border-gray-200"
											/>
										) : (
											<User className="w-4 h-4 mr-1" />
										)}
										<span>{post.userType || 'Cá Nhân'}</span>
										<span className="mx-2">•</span>
										<span>{post.createdAt ? getRelativeTime(post.createdAt) : ''}</span>
										<span className="mx-2">•</span>
										<span>{post.address || ''}</span>
									</div>
								</div>
								<div className="flex items-center space-x-2 ml-4">
									<Button
										variant="outline"
										className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 bg-transparent"
									>
										Chat
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className={
											unarchivedIds.includes(post.id)
												? 'text-red-500 hover:bg-transparent hover:text-red-600'
												: 'text-red-500 hover:bg-transparent hover:text-red-600'
										}
										disabled={toggleArchiveMutation.isPending}
										onClick={() => {
											if (unarchivedIds.includes(post.id)) {
												toggleArchiveMutation.mutate(post.id, {
													onSuccess: (res) => {
														if (res.success) {
															setUnarchivedIds((prev) =>
																prev.filter((id) => id !== post.id),
															);
															toast.success('Đã lưu lại tin!');
														} else {
															toast.error(res.message || 'Thao tác thất bại');
														}
													},
													onError: (err) => {
														const error: any = err;
														toast.error(
															error?.response?.data?.message || 'Có lỗi xảy ra',
														);
													},
												});
											} else {
												toggleArchiveMutation.mutate(post.id, {
													onSuccess: (res) => {
														if (res.success) {
															setUnarchivedIds((prev) => [...prev, post.id]);
															toast.success('Đã bỏ lưu tin!');
														} else {
															toast.error(res.message || 'Thao tác thất bại');
														}
													},
													onError: (err) => {
														const error: any = err;
														toast.error(
															error?.response?.data?.message || 'Có lỗi xảy ra',
														);
													},
												});
											}
										}}
									>
										{unarchivedIds.includes(post.id) ? (
											<Heart className="w-5 h-5 text-red-500 cursor-pointer" />
										) : (
											<Heart className="w-5 h-5 fill-red-500 cursor-pointer" />
										)}
									</Button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

export default SavedPostsPage;
