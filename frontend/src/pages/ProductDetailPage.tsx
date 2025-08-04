import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import {
	Heart,
	MessageSquare,
	ChevronLeft,
	ChevronRight,
	Share2,
	MoreVertical,
	MapPin,
	Clock,
} from 'lucide-react';
import { getRelativeTime } from '@/helper';
import {
	usePostById,
	useArchivedPosts,
	useToggleArchivePost,
} from '@/services/query/post';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QUERY_KEY } from '@/config/key';

const ageMap: Record<string, string> = {
	PUPPY: 'Chó con',
	YOUNG_DOG: 'Chó nhỏ',
	ADULT_DOG: 'Chó trưởng thành',
	OTHER: 'Khác',
};

export default function ProductDetailPage() {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, isError, refetch } = usePostById(id || '');
	const [currentImageIdx, setCurrentImageIdx] = useState(0);

	const queryClient = useQueryClient();
	const toggleArchiveMutation = useToggleArchivePost();
	const { data: archivedData } = useArchivedPosts({ page: 1, limit: 100 });
	const archivedIds =
		archivedData && archivedData.success && Array.isArray(archivedData.data)
			? (archivedData.data as { id: string }[]).map((p) => p.id)
			: [];

	useEffect(() => {
		if (id) refetch();
	}, [id]);

	if (isLoading) return <div className="p-6">Đang tải...</div>;
	if (isError || !data) return <div className="p-6">Không tìm thấy bài đăng</div>;

	const post = data;
	const mainImage = post.postImages[currentImageIdx]?.url || '/placeholder.svg';
	const thumbnails = post.postImages.map((img) => img.url);

	const handlePrev = () => {
		setCurrentImageIdx((prev) => (prev === 0 ? thumbnails.length - 1 : prev - 1));
	};
	const handleNext = () => {
		setCurrentImageIdx((prev) => (prev === thumbnails.length - 1 ? 0 : prev + 1));
	};

	return (
		<main className="pt-6 bg-gray-100 min-h-screen">
			<div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-6">
				{/* Gallery + Info */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-lg shadow p-6">
					{/* Gallery */}
					<div className="lg:col-span-5">
						<div className="relative h-[420px] flex items-center justify-center rounded overflow-hidden bg-gray-100">
							<img
								src={mainImage}
								alt={post.title}
								className="object-cover w-full h-full"
							/>
							<Button
								size="icon"
								variant="ghost"
								className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 rounded-full"
								onClick={handlePrev}
								tabIndex={0}
							>
								<ChevronLeft className="h-6 w-6" />
							</Button>
							<Button
								size="icon"
								variant="ghost"
								className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 rounded-full"
								onClick={handleNext}
								tabIndex={0}
							>
								<ChevronRight className="h-6 w-6" />
							</Button>
							<div className="absolute top-4 right-4 flex space-x-2">
								<Button size="icon" variant="ghost" className="bg-white/70 rounded-full">
									<Share2 className="h-5 w-5" />
								</Button>
								<Button size="icon" variant="ghost" className="bg-white/70 rounded-full">
									<MoreVertical className="h-5 w-5" />
								</Button>
							</div>
							<div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
								{thumbnails.length > 0
									? `${currentImageIdx + 1}/${thumbnails.length}`
									: ''}
							</div>
						</div>
						<div className="flex mt-3 gap-2 justify-center">
							{thumbnails.map((url, index) => (
								<img
									key={index}
									src={url}
									alt={`thumb ${index}`}
									className={`w-14 h-14 rounded object-cover border cursor-pointer ${index === currentImageIdx ? 'border-yellow-400' : 'border-transparent'}`}
									onClick={() => setCurrentImageIdx(index)}
								/>
							))}
						</div>
					</div>

					{/* Info */}
					<div className="lg:col-span-7 space-y-4">
						<div className="flex justify-between items-start">
							<h1 className="text-2xl font-bold leading-tight">{post.title}</h1>
							<Button
								variant="ghost"
								size="icon"
								className={
									archivedIds.includes(post.id) ? 'bg-red-500 hover:bg-red-600' : ''
								}
								onClick={() => {
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
									className={`w-5 h-5 ${archivedIds.includes(post.id) ? 'text-white' : 'text-gray-500'}`}
								/>
							</Button>
						</div>
						<p className="text-base text-muted-foreground">
							{post.category.name} • {ageMap[post.age] || 'Không rõ tuổi'}
						</p>
						<p className="text-red-600 text-2xl font-bold">
							{post.price.toLocaleString()} đ
						</p>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<MapPin className="w-4 h-4" />
							{post.address}
						</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Clock className="w-4 h-4" />
							Cập nhật {getRelativeTime(post.updatedAt)}
						</div>

						<div className="grid grid-cols-2 gap-3 mt-4">
							<Button className="bg-gray-200 text-gray-800 text-sm">
								Hiện số 091519****
							</Button>
							<Button className="bg-yellow-400 text-black hover:bg-yellow-500 text-sm">
								<MessageSquare className="w-4 h-4 mr-2" /> Chat
							</Button>
						</div>

						{/* Buyer demo */}
						<div className="flex items-center gap-4 mt-5">
							<Avatar className="w-10 h-10">
								<AvatarImage src="/placeholder.svg" />
								<AvatarFallback>T</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-semibold text-sm">Trang</p>
							</div>
						</div>

						<div className="pt-4 mt-4 border-t">
							<h3 className="text-sm font-semibold mb-2">Chat nhanh:</h3>
							<div className="flex flex-wrap gap-2">
								{[
									'Thú cưng này còn không bạn?',
									'Bạn có ship thú cưng không?',
									'Thú cưng có được tiêm chưa?',
								].map((text, i) => (
									<Button key={i} variant="outline" className="rounded-full text-xs px-3">
										{text}
									</Button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Description + Comment */}
				<div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
					<div className="lg:col-span-7 bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-bold mb-4">Mô tả chi tiết</h2>

						<p className="text-base text-muted-foreground whitespace-pre-line leading-relaxed">
							{post.description}
						</p>

						<div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2 mt-4">
							<span className="font-semibold mr-2">SĐT liên hệ:</span>
							<span className="font-semibold">091267***</span>
							<button
								className="ml-3 text-blue-600 font-semibold hover:underline focus:outline-none cursor-pointer"
								type="button"
							>
								Hiện số
							</button>
						</div>
					</div>

					<div className="lg:col-span-5 bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-bold mb-4">Bình luận</h2>
						<p className="text-muted-foreground">Chưa có bình luận nào.</p>
					</div>
				</div>
			</div>
		</main>
	);
}
