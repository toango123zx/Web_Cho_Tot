import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, UploadCloud } from 'lucide-react';
import { AddressDialog } from '@/components/dialog/AddressDialog';
import { useCurrentApp } from '@/components/context/AppContext';
import { useUserMutations } from '@/services/query';
import { uploadFileToCloudinary } from '@/services/api/cloudinary';
import { toast } from 'sonner';

export default function UpdateProfile() {
	const { user } = useCurrentApp();
	const { updateUser } = useUserMutations();

	const [userName, setUserName] = useState('');
	const [userIntroduction, setUserIntroduction] = useState('');
	const [gender, setGender] = useState<string | undefined>(undefined);
	const [dob, setDob] = useState<Date | undefined>(undefined);
	const [phoneNumber, setPhoneNumber] = useState('');

	const [userAddress, setUserAddress] = useState({
		province: '',
		provinceLabel: '',
		ward: '',
		wardLabel: '',
		specificAddress: '',
	});
	const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

	const [initialUserInfo, setInitialUserInfo] = useState({
		name: '',
		bio: '',
		gender: undefined as string | undefined,
		dob: undefined as Date | undefined,
		phoneNumber: '',
		address: {
			province: '',
			provinceLabel: '',
			ward: '',
			wardLabel: '',
			specificAddress: '',
		},
		avatar: '',
	});

	useEffect(() => {
		if (user) {
			const parsedDob = user.dob ? new Date(user.dob) : undefined;
			const initial = {
				name: user.name ?? '',
				bio: user.bio ?? '',
				gender: user.gender ?? undefined,
				dob: parsedDob,
				phoneNumber: user.phoneNumber ?? '',
				address: {
					province: '',
					provinceLabel: '',
					ward: '',
					wardLabel: '',
					specificAddress: user.address ?? '',
				},
				avatar: user.avatar ?? '',
			};
			setUserName(initial.name);
			setUserIntroduction(initial.bio);
			setGender(initial.gender);
			setDob(initial.dob);
			setPhoneNumber(initial.phoneNumber);
			setUserAddress(initial.address);
			setInitialUserInfo(initial);
			setPreviewAvatar(null);
			setAvatarFile(null);
		}
	}, [user]);

	const isPhoneNumberValid = /^\d{10}$/.test(phoneNumber.trim());
	const isBioValid = userIntroduction.trim().split(/\s+/).length <= 80;

	const addressChanged =
		userAddress.province !== initialUserInfo.address.province ||
		userAddress.provinceLabel !== initialUserInfo.address.provinceLabel ||
		userAddress.ward !== initialUserInfo.address.ward ||
		userAddress.wardLabel !== initialUserInfo.address.wardLabel ||
		userAddress.specificAddress.trim() !== initialUserInfo.address.specificAddress.trim();

	const hasChanges =
		userName.trim() !== initialUserInfo.name.trim() ||
		userIntroduction.trim() !== initialUserInfo.bio.trim() ||
		gender !== initialUserInfo.gender ||
		dob?.toISOString() !== initialUserInfo.dob?.toISOString() ||
		addressChanged ||
		phoneNumber.trim() !== initialUserInfo.phoneNumber.trim() ||
		avatarFile !== null;

	const formatAddressDisplay = () => {
		const parts: string[] = [];
		if (userAddress.specificAddress) parts.push(userAddress.specificAddress);
		if (userAddress.wardLabel) parts.push(userAddress.wardLabel);
		if (userAddress.provinceLabel) parts.push(userAddress.provinceLabel);
		return parts.join(', ') || 'Địa chỉ';
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setAvatarFile(file);
		setPreviewAvatar(URL.createObjectURL(file));
	};

	const handleSave = async () => {
		if (!user?.id || !isBioValid) return;
		if (phoneNumber.trim() !== '' && !isPhoneNumberValid) return;

		let uploadedAvatarUrl = user?.avatar ?? '';

		if (avatarFile) {
			const res = await uploadFileToCloudinary(avatarFile);
			if (!res.success || !res.data?.secure_url) {
				toast.error('Không thể tải lên ảnh đại diện. Vui lòng thử lại!');
				return;
			}
			uploadedAvatarUrl = res.data.secure_url;
		}

		const fullAddressParts: string[] = [];
		if (userAddress.specificAddress)
			fullAddressParts.push(userAddress.specificAddress.trim());
		if (userAddress.wardLabel) fullAddressParts.push(userAddress.wardLabel);
		if (userAddress.provinceLabel) fullAddressParts.push(userAddress.provinceLabel);

		const fullAddress = fullAddressParts.join(', ');

		const data: IUserUpdatePayload = {
			name: userName.trim(),
			bio: userIntroduction.trim(),
			gender: gender ? (gender.toUpperCase() as Gender) : null,
			address: fullAddress,
			avatar: uploadedAvatarUrl,
			dateOfBirth: dob ? dob.toISOString() : null,
		};

		if (phoneNumber.trim() !== '') {
			data.phoneNumber = phoneNumber.trim();
		}

		updateUser.mutate({ id: user.id, data });
	};

	return (
		<div>
			<h1 className="text-xl font-bold text-gray-900 mb-8">Hồ sơ cá nhân</h1>

			{/* Avatar */}
			<div className="mb-6">
				<Label className="text-sm font-medium text-gray-700 mb-2 block">
					Ảnh đại diện
				</Label>
				<div className="flex items-center space-x-4">
					<img
						src={previewAvatar || user?.avatar || '/placeholder-avatar.png'}
						alt="avatar"
						className="w-20 h-20 rounded-full object-cover border"
					/>
					<div>
						<input
							type="file"
							accept="image/*"
							id="avatar-upload"
							className="hidden"
							onChange={handleAvatarChange}
						/>
						<label
							htmlFor="avatar-upload"
							className="cursor-pointer inline-flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
						>
							<UploadCloud className="w-4 h-4 mr-2" />
							Chọn ảnh
						</label>
					</div>
				</div>
			</div>

			{/* Basic information */}
			<div className="mb-8 space-y-6">
				<div className="grid grid-cols-2 gap-6">
					<div>
						<Label
							htmlFor="name"
							className="text-sm font-medium text-gray-700 mb-2 block"
						>
							Họ và tên
						</Label>
						<Input
							id="name"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							required
						/>
					</div>
					<div>
						<Label
							htmlFor="phone"
							className="text-sm font-medium text-gray-700 mb-2 block"
						>
							Số điện thoại
						</Label>
						<Input
							id="phone"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
						/>
						{phoneNumber.trim() !== '' && !isPhoneNumberValid && (
							<p className="text-sm text-red-500 mt-1">
								Số điện thoại phải có đúng 10 chữ số
							</p>
						)}
					</div>
				</div>

				<div>
					<Label
						htmlFor="address"
						className="text-sm font-medium text-gray-700 mb-2 block"
					>
						Địa chỉ
					</Label>
					<Input
						id="address"
						readOnly
						className="cursor-pointer"
						value={formatAddressDisplay()}
						onClick={() => setIsAddressDialogOpen(true)}
					/>
				</div>

				<div>
					<Label
						htmlFor="introduction"
						className="text-sm font-medium text-gray-700 mb-2 block"
					>
						Giới thiệu
					</Label>
					<textarea
						id="introduction"
						placeholder="Viết vài dòng giới thiệu về gian hàng của bạn..."
						className="w-full min-h-[100px] max-h-[150px] resize-y overflow-y-auto border border-gray-300 rounded-md px-3 py-2"
						value={userIntroduction}
						onChange={(e) => setUserIntroduction(e.target.value)}
					/>
					<p className="text-xs mt-1">
						{isBioValid ? (
							<span className="text-gray-500">Tối đa 80 từ</span>
						) : (
							<span className="text-red-500">Vượt quá 80 từ</span>
						)}
					</p>
				</div>
			</div>

			{/* Security information */}
			<div className="mb-8 space-y-6">
				<h2 className="text-lg font-semibold">Thông tin bảo mật</h2>
				<p className="text-sm text-gray-600">
					Những thông tin dưới đây sẽ mang tính bảo mật. Chỉ bạn mới có thể thấy và chỉnh
					sửa.
				</p>

				<div>
					<Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
						Email
					</Label>
					<Input id="email" value={user?.email ?? ''} disabled />
				</div>

				<div className="grid grid-cols-2 gap-6">
					<div>
						<Label className="text-sm font-medium text-gray-700 mb-2 block">
							Giới tính
						</Label>
						<Select onValueChange={setGender} value={gender}>
							<SelectTrigger>
								<SelectValue placeholder="Chọn giới tính" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="MALE">Nam</SelectItem>
								<SelectItem value="FEMALE">Nữ</SelectItem>
								<SelectItem value="OTHER">Khác</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label className="text-sm font-medium text-gray-700 mb-2 block">
							Ngày, tháng, năm sinh
						</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										'w-full justify-start text-left font-normal',
										!dob && 'text-muted-foreground',
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{dob ? format(dob, 'dd/MM/yyyy') : <span>Chọn ngày sinh</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={dob}
									onSelect={setDob}
									captionLayout="dropdown"
									hidden={{
										before: new Date(1900, 0, 1),
										after: new Date(new Date().getFullYear(), 11, 31),
									}}
								/>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				<Button
					onClick={handleSave}
					disabled={!hasChanges || !isBioValid}
					className={cn(
						'text-white px-8',
						hasChanges && isBioValid
							? 'bg-[#FF8800] hover:bg-orange-600'
							: 'bg-[#C0C0C0] cursor-not-allowed pointer-events-none',
					)}
				>
					LƯU THAY ĐỔI
				</Button>
			</div>

			{/* Address */}
			<AddressDialog
				isOpen={isAddressDialogOpen}
				onClose={() => setIsAddressDialogOpen(false)}
				onSave={setUserAddress}
				initialAddress={userAddress}
			/>
		</div>
	);
}
