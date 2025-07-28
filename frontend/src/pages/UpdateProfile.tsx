import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { CalendarIcon } from 'lucide-react';
import { AddressDialog } from '@/components/dialog/AddressDialog';

export default function UpdateProfile() {
	const initialUserName = 'Võ Văn Minh';
	const initialUserIntroduction = '';
	const initialReferenceName = '';
	const initialGender = undefined;
	const initialDob = undefined;
	const initialUserAddress = {
		province: '',
		provinceLabel: '',
		ward: '',
		wardLabel: '',
		specificAddress: '',
	};

	const [userName, setUserName] = useState(initialUserName);
	const [userIntroduction, setUserIntroduction] = useState(initialUserIntroduction);
	const [referenceName, setReferenceName] = useState(initialReferenceName);
	const [gender, setGender] = useState<string | undefined>(initialGender);
	const [dob, setDob] = useState<Date | undefined>(initialDob);
	const [userAddress, setUserAddress] = useState(initialUserAddress);

	const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

	const currentUserEmail = 'vvm1004@gmail.com';
	const currentUserPhone = '0974482032';

	const hasChanges =
		userName !== initialUserName ||
		userIntroduction !== initialUserIntroduction ||
		referenceName !== initialReferenceName ||
		gender !== initialGender ||
		dob !== initialDob ||
		userAddress.province !== initialUserAddress.province ||
		userAddress.ward !== initialUserAddress.ward ||
		userAddress.specificAddress !== initialUserAddress.specificAddress;

	const formatAddressDisplay = () => {
		const parts: string[] = [];
		if (userAddress.specificAddress) parts.push(userAddress.specificAddress);
		if (userAddress.wardLabel) parts.push(userAddress.wardLabel);
		if (userAddress.provinceLabel) parts.push(userAddress.provinceLabel);
		return parts.join(', ') || 'Địa chỉ';
	};

	return (
		<div>
			<h1 className="text-xl font-bold text-gray-900 mb-8">Hồ sơ cá nhân</h1>

			{/* Hồ sơ cá nhân */}
			<div className="mb-8 space-y-6">
				<div className="grid grid-cols-2 gap-6">
					<div>
						<Label
							htmlFor="name"
							className="text-sm font-medium text-gray-700 mb-2 block"
						>
							Họ và tên *
						</Label>
						<Input
							id="name"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							className="w-full"
							required
						/>
					</div>
					<div>
						<Label
							htmlFor="phone"
							className="text-sm font-medium text-gray-700 mb-2 block"
						>
							Số điện thoại *
						</Label>
						<Input
							id="phone"
							defaultValue={currentUserPhone}
							className="w-full"
							required
							disabled
						/>
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
						placeholder="Địa chỉ"
						className="w-full cursor-pointer"
						readOnly
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
					<Textarea
						id="introduction"
						placeholder="Viết vài dòng giới thiệu về gian hàng của bạn..."
						className="w-full min-h-[100px] resize-none"
						value={userIntroduction}
						onChange={(e) => setUserIntroduction(e.target.value)}
					/>
					<p className="text-xs text-gray-500 mt-1">Tối đa 60 từ</p>
				</div>

				<div>
					<Label
						htmlFor="reference"
						className="text-sm font-medium text-gray-700 mb-2 block"
					>
						Tên gợi nhớ
					</Label>
					<Input
						id="reference"
						value={referenceName}
						onChange={(e) => setReferenceName(e.target.value)}
						placeholder="Tên gợi nhớ của bạn"
						className="w-full"
					/>
					<p className="text-xs text-gray-500 mt-1">
						<span className="text-blue-600">{`${window.location.origin}/user/${referenceName}`}</span>
						<br />
						<br />
						Tên gợi nhớ sau khi được cập nhật sẽ không thể thay đổi trong vòng 60 ngày
						tới.
					</p>
				</div>
			</div>

			{/* Thông tin bảo mật */}
			<div className="mb-8 space-y-6">
				<div>
					<h2 className="text-lg font-semibold">Thông tin bảo mật</h2>
					<p className="text-sm text-gray-600">
						Những thông tin dưới đây sẽ mang tính bảo mật. Chỉ bạn mới có thể thấy và
						chỉnh sửa những thông tin này.
					</p>
				</div>

				<div>
					<Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
						Email
					</Label>
					<Input id="email" value={currentUserEmail} disabled className="w-full" />
				</div>

				<div className="grid grid-cols-2 gap-6">
					<div>
						<Label className="text-sm font-medium text-gray-700 mb-2 block">
							Giới tính
						</Label>
						<Select onValueChange={setGender} value={gender}>
							<SelectTrigger className="cursor-pointer">
								<SelectValue placeholder="Chọn giới tính" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="male">Nam</SelectItem>
								<SelectItem value="female">Nữ</SelectItem>
								<SelectItem value="other">Khác</SelectItem>
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
					disabled={!hasChanges}
					className={cn(
						'text-white px-8',
						hasChanges
							? 'bg-[#FF8800] hover:bg-orange-600 cursor-pointer'
							: 'bg-[#C0C0C0] cursor-default pointer-events-none',
					)}
				>
					LƯU THAY ĐỔI
				</Button>
			</div>

			{/* Address dialog */}
			<AddressDialog
				isOpen={isAddressDialogOpen}
				onClose={() => setIsAddressDialogOpen(false)}
				onSave={setUserAddress}
				initialAddress={userAddress}
			/>
		</div>
	);
}
