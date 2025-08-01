import { useEffect, useState } from 'react';
import { Heart, MapPin, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePosts } from '@/services/query/post';

const LIMIT = 9;

export default function HomePage() {
	const [page, setPage] = useState(1);
	const [postList, setPostList] = useState<IPost[]>([]);

	const { data, isLoading } = usePosts(page, LIMIT);

	useEffect(() => {
		if (data?.success && data.data.length > 0) {
			setPostList((prev) => [...prev, ...data.data]);
		}
	}, [data]);

	const handleLoadMore = () => {
		setPage((prev) => prev + 1);
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
					<p>Đang tải sản phẩm...</p>
				) : postList.length === 0 ? (
					<p>Không có sản phẩm nào</p>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{postList.map((post) => (
							<div key={post.id} className="cursor-pointer group">
								<div className="relative">
									<img
										src={post.postImages[0]?.url || '/placeholder.svg'}
										alt={post.title}
										className="w-full h-40 sm:h-48 object-cover transition-transform duration-200 group-hover:scale-105 rounded-md"
									/>

									{/* Heart Icon */}
									<Button
										variant="ghost"
										size="icon"
										className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 h-8 w-8 rounded-full border-0"
									>
										<Heart className="h-4 w-4 text-white" />
									</Button>
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
				{data?.success && data.data.length === LIMIT && (
					<div className="text-center mt-8">
						<Button
							onClick={handleLoadMore}
							variant="outline"
							className="px-8 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
							disabled={isLoading}
						>
							{isLoading ? 'Đang tải...' : 'Xem thêm'}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
