import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash } from 'lucide-react';
import { GoodCoinIcon } from '@/assets/icons';
import { usePostsByUserId, useDeletePost } from '@/services/query/post';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import {QUERY_KEY} from 'key';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
	DialogClose,
} from '@/components/ui/dialog';
import { useCurrentApp } from '@/components/context/AppContext';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/config/key';

function AdItem({
	post,
	onDeleted,
}: {
	post: IPostWithCategoryAndUser;
	onDeleted?: () => void;
}) {
	const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const handleDelete = () => setOpen(true);
	const queryClient = useQueryClient();
	const handleConfirmDelete = () => {
		deletePost(post.id, {
			onSuccess: (res: any) => {
				setOpen(false);
				if (res?.success) {
					toast.success('Xóa thành công');
					if (onDeleted) onDeleted();
				} else {
					toast.error(res?.message || 'Xóa thất bại');
				}
			},
			onError: (err: any) => {
				setOpen(false);
				toast.error(err?.response?.data?.message || 'Xóa thất bại');
			},
		});
	};
	const handleEdit = () => {
		queryClient.invalidateQueries({ queryKey: QUERY_KEY.getPostById(post.id) });
		navigate(`/update-post/${post.id}`);
	};
	return (
		<>
			<Card className="flex flex-row items-center gap-5 p-4 shadow-sm">
				{/* Image with link */}
				<Link to={`/posts/${post.id}`} className="block">
					<img
						src={post.postImages[0]?.url || '/placeholder.svg'}
						alt={post.title}
						width={140}
						height={140}
						className="rounded-xl object-cover aspect-square flex-shrink-0 border border-gray-200"
					/>
				</Link>

				{/* Content */}
				<div className="flex-1 flex flex-col h-full justify-center min-w-0">
					<div className="flex flex-col gap-1 min-w-0">
						<Link to={`/posts/${post.id}`} className="font-bold text-lg truncate mb-0.5">
							{post.title}
						</Link>
						<p className="text-rose-600 font-bold text-xl mb-0.5">
							{post.price.toLocaleString()} đ
						</p>
						<p className="text-sm text-gray-500 truncate">{post.address}</p>
					</div>
					{/* Action buttons */}
					<div className="flex flex-col sm:flex-row gap-2 justify-end mt-4">
						<Button
							className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
							onClick={handleEdit}
						>
							<Pencil className="h-4 w-4" />
							Sửa tin
						</Button>
						<Button
							variant="outline"
							className="flex items-center justify-center gap-1 text-red-600 border-red-300 hover:bg-red-50 bg-transparent w-full sm:w-auto"
							onClick={handleDelete}
							disabled={isDeleting}
						>
							<Trash className="h-4 w-4" />
							{isDeleting ? 'Đang xóa...' : 'Xóa tin'}
						</Button>
					</div>
				</div>
			</Card>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Xác nhận xóa tin</DialogTitle>
						<DialogDescription>
							Bạn có chắc chắn muốn xóa bài đăng này không? Hành động này không thể hoàn
							tác.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline" disabled={isDeleting}>
								Hủy
							</Button>
						</DialogClose>
						<Button
							variant="destructive"
							onClick={handleConfirmDelete}
							disabled={isDeleting}
						>
							{isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
export default function ManagePost() {
	const { user } = useCurrentApp();
	const userId = user?.id;
	const { data: posts, isLoading, refetch } = usePostsByUserId(userId ?? '');
	const [tab, setTab] = useState<'active' | 'expired' | 'rejected' | 'pending'>(
		'pending',
	);

	const filteredPosts = useMemo(() => {
		if (!posts) return [];
		if (tab === 'pending') return posts.filter((p) => p.status === 'PENDING');
		if (tab === 'active') return posts.filter((p) => p.status === 'PUBLISHED');
		if (tab === 'expired') return posts.filter((p) => p.status === 'EXPIRED');
		if (tab === 'rejected') return posts.filter((p) => p.status === 'DELETED');
		return posts;
	}, [posts, tab]);

	const postUser = posts?.[0]?.user;

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto max-w-6xl px-4 py-6 md:px-6 lg:px-8">
				{/* Info + Tabs Trigger */}
				<Card className="bg-white p-4 rounded-lg shadow-sm">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-gray-200 pt-6">
						<div className="flex items-center gap-3">
							<Avatar className="h-12 w-12 bg-blue-500 text-white font-bold text-xl">
								{postUser?.avatar ? (
									<img
										src={postUser.avatar}
										alt={postUser.name}
										className="w-full h-full rounded-full object-cover"
									/>
								) : (
									<AvatarFallback>{postUser?.name?.[0] || 'U'}</AvatarFallback>
								)}
							</Avatar>
							<div>
								<p className="font-semibold text-lg">{postUser?.name || 'User'}</p>
							</div>
						</div>
						<div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md border border-gray-200 flex-shrink-0">
							<img
								src={GoodCoinIcon}
								alt="Đồng Tốt icon"
								width={20}
								height={20}
								className="inline-block mr-1"
							/>
							<span className="text-sm text-gray-700">
								{'Số dư:'} <span className="font-bold">{'20.000'}</span>
							</span>
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6 text-green-600 hover:bg-green-50"
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Tabs trigger only */}
					<Tabs
						value={tab}
						onValueChange={(value) =>
							setTab(value as 'active' | 'expired' | 'rejected' | 'pending')
						}
						className="w-full"
					>
						<TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-7 h-auto bg-white p-0 rounded-none ">
							<TabsTrigger
								value="active"
								className="py-3 px-2 text-sm font-bold border-b-2 border-transparent data-[state=active]:border-[#FF8800] data-[state=active]:bg-white data-[state=active]:text-[#FF8800] data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 rounded-none whitespace-nowrap transition-colors"
							>
								{`ĐANG HIỂN THỊ (${posts?.filter((p) => p.status === 'PUBLISHED').length || 0})`}
							</TabsTrigger>
							<TabsTrigger
								value="expired"
								className="py-3 px-2 text-sm font-bold border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-white data-[state=active]:text-orange-500 data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 rounded-none whitespace-nowrap transition-colors"
							>
								{`HẾT HẠN (${posts?.filter((p) => p.status === 'EXPIRED').length || 0})`}
							</TabsTrigger>
							<TabsTrigger
								value="rejected"
								className="py-3 px-2 text-sm font-bold border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-white data-[state=active]:text-orange-500 data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 rounded-none whitespace-nowrap transition-colors"
							>
								{`BỊ TỪ CHỐI (${posts?.filter((p) => p.status === 'DELETED').length || 0})`}
							</TabsTrigger>
							<TabsTrigger
								value="pending"
								className="py-3 px-2 text-sm font-bold border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-white data-[state=active]:text-orange-500 data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 rounded-none whitespace-nowrap transition-colors"
							>
								{`CHỜ DUYỆT (${posts?.filter((p) => p.status === 'PENDING').length || 0})`}
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</Card>

				{/* Post content */}
				<div className="mt-2 space-y-4">
					{isLoading ? (
						<p>Đang tải...</p>
					) : filteredPosts.length === 0 ? (
						<p>Không có tin nào.</p>
					) : (
						filteredPosts.map((post: IPostWithCategoryAndUser) => (
							<AdItem
								key={post.id}
								post={post}
								onDeleted={typeof refetch === 'function' ? refetch : undefined}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
}
