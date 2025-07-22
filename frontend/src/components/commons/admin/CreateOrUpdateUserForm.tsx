import { uploadFileToCloudinary } from '@/services/api/cloudinary';
import { useUserMutations } from '@/services/query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button, Input } from '@/components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { trimData } from '@/helper';
import { useLoading } from '@/hooks';
import { validate } from '@/lib/validation';
import {
	createUserValidationSchema,
	updateUserValidationSchema,
} from '@/lib/validation-schemas';

type Props = {
	open: boolean;
	isEditing: boolean;
	onClose: () => void;
	initialData?: IUser | null;
	onSuccess: () => void;
};

export default function CreateOrUpdateUserForm({
	open,
	onClose,
	isEditing,
	initialData,
}: Props) {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		avatar: '',
		address: '',
		phoneNumber: '',
		bio: '',
		dateOfBirth: '',
		gender: 'MALE' as Gender,
		role: 'USER' as UserRole,
	});
	const [file, setFile] = useState<File>();
	const [errors, setErrors] = useState<Record<keyof IUserCreation, string>>({
		address: '',
		bio: '',
		dateOfBirth: '',
		email: '',
		name: '',
		password: '',
		phoneNumber: '',
		gender: '',
	});

	const { loading: isUploadingImage, execute: uploadImage } = useLoading();
	const { updateUser, createUser } = useUserMutations();

	useEffect(() => {
		if (initialData) {
			setFormData({
				name: initialData.name,
				email: initialData.email,
				password: '',
				avatar: initialData.avatar,
				address: initialData.address || '',
				phoneNumber: initialData.phoneNumber || '',
				bio: initialData.bio || '',
				dateOfBirth: initialData.dob || '',
				gender: initialData.gender || 'MALE',
				role: initialData.role,
			});
		} else {
			setFormData({
				name: '',
				email: '',
				password: '',
				avatar: '',
				address: '',
				phoneNumber: '',
				bio: '',
				dateOfBirth: '',
				gender: 'MALE',
				role: 'USER',
			});
		}
	}, [initialData]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const validateUpdatationForm = () => {
		const { isValid, errors } = validate(formData, updateUserValidationSchema);
		console.log(isValid);

		setErrors(errors as Record<keyof IUserCreation, string>);
		return isValid;
	};

	const validateCreationForm = () => {
		const { isValid, errors } = validate(formData, createUserValidationSchema);
		console.log(isValid);

		setErrors(errors);
		return isValid;
	};

	const handleSubmit = async () => {
		await uploadImage(async () => {
			let avatar = formData.avatar;
			if (file) {
				const res = await uploadFileToCloudinary(file);
				if (res.success) {
					avatar = res.data.secure_url;
				} else {
					toast.error(res.message);
				}
			}

			if (isEditing) {
				handleUpdateUser(avatar);
			} else {
				handleCreateUser();
			}
		});
	};

	const handleUpdateUser = (avatar: string) => {
		const isValid = validateUpdatationForm();
		if (!initialData?.id || !isValid) return;

		const { email, password, role, ...trimmedFormData } =
			trimData<typeof formData>(formData);
		updateUser.mutate(
			{
				id: initialData.id,
				data: {
					...trimmedFormData,
					avatar,
					dateOfBirth: trimmedFormData.dateOfBirth
						? new Date(trimmedFormData.dateOfBirth).toISOString()
						: '',
				},
			},
			{
				onSuccess: onClose,
			},
		);
	};

	const handleCreateUser = () => {
		const isValid = validateCreationForm();
		if (!isValid) return;

		const { avatar, role, ...trimmedFormData } = trimData<typeof formData>(formData);
		createUser.mutate(
			{
				...trimmedFormData,
				dateOfBirth: trimmedFormData.dateOfBirth
					? new Date(trimmedFormData.dateOfBirth).toISOString()
					: '',
			},
			{
				onSuccess: onClose,
			},
		);
	};

	const handleAvatarChange = async (file: File) => {
		const imageURL = URL.createObjectURL(file);
		setFormData({ ...formData, avatar: imageURL });
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-3">
					{isEditing && (
						<div className="space-y-1 flex flex-col items-center">
							<label className="block text-sm font-medium">Avatar</label>
							{formData.avatar && (
								<img
									src={formData.avatar}
									alt="Avatar"
									className="w-16 h-16 rounded-full object-cover"
								/>
							)}
							<Button>
								<label htmlFor="avatar" className="cursor-pointer">
									Chọn avatar
									<Input
										type="file"
										accept="image/*"
										id="avatar"
										hidden
										disabled={updateUser.isPending || isUploadingImage}
										onChange={(e) => {
											const file = e.target.files?.[0];
											setFile(file);
											if (file) handleAvatarChange(file);
										}}
									/>
								</label>
							</Button>
						</div>
					)}
					<Input
						placeholder="Tên"
						name="name"
						disabled={updateUser.isPending || isUploadingImage}
						value={formData.name}
						onChange={handleChange}
					/>
					{errors['name'] && <p className="text-xs text-red-500">{errors['name']}</p>}
					<Input
						placeholder="Email"
						name="email"
						disabled={isEditing}
						value={formData.email}
						onChange={handleChange}
					/>
					{errors['email'] && <p className="text-xs text-red-500">{errors['email']}</p>}
					{!isEditing && (
						<>
							<Input
								placeholder="Mật khẩu"
								name="password"
								disabled={updateUser.isPending || isUploadingImage}
								value={formData.password}
								onChange={handleChange}
							/>
							{errors['password'] && (
								<p className="text-xs text-red-500">{errors['password']}</p>
							)}
						</>
					)}

					<Input
						placeholder="Địa chỉ"
						name="address"
						disabled={updateUser.isPending || isUploadingImage}
						value={formData.address}
						onChange={handleChange}
					/>
					{errors['address'] && (
						<p className="text-xs text-red-500">{errors['address']}</p>
					)}
					<Input
						type="number"
						placeholder="SĐT"
						name="phoneNumber"
						disabled={updateUser.isPending || isUploadingImage}
						value={formData.phoneNumber}
						onChange={handleChange}
					/>
					{errors['phoneNumber'] && (
						<p className="text-xs text-red-500">{errors['phoneNumber']}</p>
					)}
					<Input
						placeholder="Tiểu sử"
						name="bio"
						disabled={updateUser.isPending || isUploadingImage}
						value={formData.bio}
						onChange={handleChange}
					/>
					{errors['bio'] && <p className="text-xs text-red-500">{errors['bio']}</p>}
					<Input
						placeholder="Ngày sinh"
						name="dateOfBirth"
						type="date"
						disabled={updateUser.isPending || isUploadingImage}
						value={formData.dateOfBirth}
						onChange={handleChange}
					/>
					{errors['dateOfBirth'] && (
						<p className="text-xs text-red-500">{errors['dateOfBirth']}</p>
					)}

					<Select
						disabled={updateUser.isPending || isUploadingImage}
						value={formData.gender}
						onValueChange={(val) => setFormData({ ...formData, gender: val as Gender })}
					>
						<SelectTrigger>
							<SelectValue placeholder="Chọn giới tính" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="MALE">Nam</SelectItem>
							<SelectItem value="FEMALE">Nữ</SelectItem>
							<SelectItem value="OTHER">Khác</SelectItem>
						</SelectContent>
					</Select>
					{errors['gender'] && <p className="text-xs text-red-500">{errors['gender']}</p>}

					<Select
						disabled={isEditing}
						value={formData.role}
						onValueChange={(val) => setFormData({ ...formData, role: val as UserRole })}
					>
						<SelectTrigger>
							<SelectValue placeholder="Chọn vai trò" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="USER">User</SelectItem>
							<SelectItem value="ADMIN">Admin</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="pt-4 flex justify-end gap-2">
					<Button
						variant="outline"
						onClick={onClose}
						disabled={updateUser.isPending || isUploadingImage}
					>
						Hủy
					</Button>
					<Button
						disabled={updateUser.isPending || isUploadingImage}
						onClick={handleSubmit}
					>
						{updateUser.isPending || isUploadingImage
							? 'Đang lưu...'
							: isEditing
								? 'Cập nhật'
								: 'Tạo mới'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
