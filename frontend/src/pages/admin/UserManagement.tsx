import { UserTable } from '@/components/commons/admin';
import CreateOrUpdateUserForm from '@/components/commons/admin/CreateOrUpdateUserForm';
import { UserDetail } from '@/components/commons/admin/UserDetail';
import { Button } from '@/components/ui';
import { useState } from 'react';

export default function UserManagement() {
	const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formOpen, setFormOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<IUser | null>(null);
	const [detailOpen, setDetailOpen] = useState(false);

	const openEditForm = (selectedUser: IUser) => {
		setIsEditing(true);
		setFormOpen(true);
		setEditingUser(selectedUser);
	};

	const openCreateForm = () => {
		setIsEditing(false);
		setFormOpen(true);
	};

	const handleViewUser = (user: IUser) => {
		setSelectedUser(user);
		setDetailOpen(true);
	};

	return (
		<>
			<div className="flex justify-between items-center mb-4 flex-wrap gap-2">
				<h1 className="text-2xl font-bold">Quản lý người dùng</h1>
				<Button onClick={openCreateForm}>+ Thêm người dùng</Button>
			</div>

			<UserTable onView={handleViewUser} onEdit={openEditForm} />

			{/* Form thêm / cập nhật */}
			<CreateOrUpdateUserForm
				open={formOpen}
				isEditing={isEditing}
				onClose={() => {
					setFormOpen(false);
					setEditingUser(null);
				}}
				initialData={editingUser}
				onSuccess={() => {}}
			/>

			{/* Dialog chi tiết người dùng */}
			<UserDetail
				user={selectedUser}
				open={detailOpen}
				onClose={() => {
					setDetailOpen(false);
					setSelectedUser(null);
				}}
			/>
		</>
	);
}
