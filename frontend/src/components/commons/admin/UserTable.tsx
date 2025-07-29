import { Eye, Loader, Pencil, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useUserQueryWithPagination, useUserMutations } from '@/services/query';
import { GlobalPopup, useGlobalPopup } from '../popup';
import { toast } from 'sonner';

type Props = {
	onView: (user: IUser) => void;
	onEdit: (user: IUser) => void;
};

const ITEMS_PER_PAGE = 10;

export function UserTable({ onView, onEdit }: Props) {
	const [searchParams, setSearchParams] = useSearchParams();
	const [deletingUserId, setDeletingUserId] = useState<string>();
	const { deleteUser } = useUserMutations();

	const search = searchParams.get('search') || '';
	const page = parseInt(searchParams.get('page') || '1', 10);
	const { popupState, confirm, hidePopup } = useGlobalPopup();

	const { data: users, isFetching } = useUserQueryWithPagination({
		page,
		limit: ITEMS_PER_PAGE,
	});

	const filtered = useMemo(() => {
		if (!users?.success) return [];

		return users.data.filter(
			(user) =>
				user.name.toLowerCase().includes(search.toLowerCase()) ||
				user.email.toLowerCase().includes(search.toLowerCase()),
		);
	}, [users, search]);

	const setSearch = (value: string) => {
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			next.set('search', value);
			next.set('page', '1');
			return next;
		});
	};

	const goToPage = (pageNum: number) => {
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			next.set('page', String(pageNum));
			return next;
		});
	};

	const handleDeleteUser = async (user: IUser) => {
		confirm('Xóa người dùng', `Bạn chắc chắn muốn xóa "${user.name}"?`, async () => {
			setDeletingUserId(user.id);
			deleteUser.mutate(user.id, {
				onSuccess: () => {
					toast.success('Xóa người dùng thành công');
					setDeletingUserId(undefined);
				},
			});
		});
	};

	return (
		<div className="space-y-4">
			<GlobalPopup
				{...popupState.config}
				isOpen={popupState.isOpen}
				onClose={hidePopup}
			/>
			<Input
				placeholder="Tìm kiếm tên hoặc email..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Avatar</TableHead>
						<TableHead>Tên</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Vai trò</TableHead>
						<TableHead>Số dư</TableHead>
						<TableHead className="text-right">Hành động</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isFetching ? (
						<TableRow>
							<TableCell colSpan={6}>
								<div className="flex h-24 justify-center items-center">
									<Loader className="animate-spin" />
								</div>
							</TableCell>
						</TableRow>
					) : filtered.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6}>
								<div className="text-center h-24 flex items-center justify-center">
									Không tìm thấy người dùng
								</div>
							</TableCell>
						</TableRow>
					) : (
						filtered.map((user) => (
							<TableRow key={user.id}>
								<TableCell>
									<img
										src={user.avatar}
										alt="avatar"
										className="w-8 h-8 rounded-full object-cover"
									/>
								</TableCell>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell className="capitalize">{user.role}</TableCell>
								<TableCell>{user.balance.toLocaleString()}₫</TableCell>
								<TableCell className="text-right space-x-1">
									<Button
										disabled={deleteUser.isPending}
										size="icon"
										variant="outline"
										onClick={() => onView(user)}
									>
										<Eye className="w-4 h-4" />
									</Button>
									<Button
										disabled={deleteUser.isPending}
										size="icon"
										variant="outline"
										onClick={() => onEdit(user)}
									>
										<Pencil className="w-4 h-4" />
									</Button>
									<Button
										disabled={deleteUser.isPending}
										size="icon"
										variant="destructive"
										onClick={() => handleDeleteUser(user)}
									>
										{deletingUserId === user.id ? (
											<Loader className="animate-spin" />
										) : (
											<Trash className="w-4 h-4" />
										)}
									</Button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			{users?.success && users.pagination.totalPages > 1 && (
				<div className="flex justify-between items-center pt-2">
					<Button onClick={() => goToPage(page - 1)} disabled={page === 1}>
						Trang trước
					</Button>
					<span>
						Trang {page} / {users.pagination.totalPages}
					</span>
					<Button
						onClick={() => goToPage(page + 1)}
						disabled={page === users.pagination.totalPages}
					>
						Trang sau
					</Button>
				</div>
			)}
		</div>
	);
}
