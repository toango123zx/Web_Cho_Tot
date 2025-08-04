// SavedPostsPage.tsx
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const savedPosts = [
	{
		id: 1,
		title: 'Samsung zflip thanh lý cho ae cần trải nghiệm',
		price: '1.900.000 đ',
		location: 'Quận 8',
		time: '1 Tuần Trước',
		image: '/images/zflip.jpg', // Replace with actual path
		isPersonal: true,
		chatAvailable: true,
	},
	{
		id: 2,
		title: 'Poddle size tiny 🏕️ trông xinh iu',
		price: '1.800.000 đ',
		location: 'Quận Bình Tân',
		time: '2 Tháng Trước',
		image: '/images/poodle.jpg', // Replace with actual path
		isPersonal: true,
		chatAvailable: true,
	},
];

export default function SavedPostsPage() {
	return (
		<div className="max-w-5xl mx-auto px-4 py-6">
			<div className="text-sm text-gray-500 mb-2">
				<span className="text-gray-600">Chợ Tốt</span> {'>'}{' '}
				<span className="font-semibold">Tin đăng đã lưu</span>
			</div>
			<h2 className="text-xl font-bold mb-4">Tin đăng đã lưu (2 / 100)</h2>

			<div className="space-y-4">
				{savedPosts.map((post) => (
					<Card key={post.id} className="flex gap-4 p-4">
						<div className="relative w-28 h-28 shrink-0">
							<img
								src={post.image}
								alt={post.title}
								className="w-full h-full object-cover rounded"
							/>
							<span className="absolute top-1 right-1 bg-black text-white text-xs px-1.5 py-0.5 rounded">
								{post.id === 1 ? 4 : 1}
							</span>
						</div>

						<div className="flex flex-col justify-between flex-1">
							<div>
								<h3 className="font-medium leading-snug line-clamp-2">{post.title}</h3>
								<p className="text-red-600 font-semibold mt-1">{post.price}</p>
							</div>
							<div className="text-sm text-gray-500 flex items-center gap-2 mt-2">
								<span>{post.isPersonal ? 'Cá Nhân' : 'Cửa Hàng'}</span>
								<span>•</span>
								<span>{post.time}</span>
								<span>•</span>
								<span>{post.location}</span>
							</div>
						</div>

						<div className="flex flex-col justify-between items-center">
							<Button
								variant="outline"
								className="text-green-600 border-green-600 hover:bg-green-50"
							>
								Chat
							</Button>
							<Heart className="text-red-500 mt-2" fill="red" size={20} />
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
