import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { PasswordChangedModal } from '@/components/modals/PasswordChangedModal';
import { useChangePassword } from '@/services/query';
import { useCurrentApp } from '@/components/context/AppContext';

function validatePassword(password: string) {
	return {
		hasUpperCase: /[A-Z]/.test(password),
		hasLowerCase: /[a-z]/.test(password),
		hasNumber: /[0-9]/.test(password),
		hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
	};
}

export default function AccountSettingsPage() {
	const navigate = useNavigate();
	const { mutate: changePassword, isPending } = useChangePassword();

	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
	const { setIsAuthenticated } = useCurrentApp();
	const [errors, setErrors] = useState({
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	});

	const handlePasswordChange = () => {
		const validation = validatePassword(newPassword);

		const newErrors = {
			currentPassword: currentPassword ? '' : 'Vui lòng nhập mật khẩu hiện tại.',
			newPassword: '',
			confirmNewPassword: '',
		};

		if (!newPassword) {
			newErrors.newPassword = 'Vui lòng nhập mật khẩu mới.';
		} else if (
			!validation.hasUpperCase ||
			!validation.hasLowerCase ||
			!validation.hasNumber ||
			!validation.hasSpecialChar
		) {
			newErrors.newPassword =
				'Mật khẩu phải chứa ít nhất 1 số, 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 ký tự đặc biệt';
		}

		if (!confirmNewPassword) {
			newErrors.confirmNewPassword = 'Vui lòng xác nhận mật khẩu mới.';
		} else if (newPassword !== confirmNewPassword) {
			newErrors.confirmNewPassword = 'Mật khẩu xác nhận không khớp.';
		}

		setErrors(newErrors);
		if (Object.values(newErrors).some((msg) => msg !== '')) return;

		changePassword(
			{ currentPassword, newPassword },
			{
				onSuccess: (res) => {
					if (res.success) {
						setIsSuccessModalOpen(true);
						setCurrentPassword('');
						setNewPassword('');
						setConfirmNewPassword('');
						setErrors({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
					} else {
						toast.error(res.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
					}
				},
				onError: (error: any) => {
					const message =
						error?.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
					toast.error(message);
				},
			},
		);
	};

	return (
		<div>
			<h2 className="text-lg font-semibold mb-4">Thay đổi mật khẩu</h2>

			<div className="grid gap-4 mb-6">
				<div className="grid gap-1">
					<Input
						type="password"
						placeholder="Mật khẩu hiện tại *"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						className={cn(errors.currentPassword && 'border-red-500')}
					/>
					{errors.currentPassword && (
						<p className="text-sm text-red-500">{errors.currentPassword}</p>
					)}
				</div>

				<div className="grid gap-1">
					<Input
						type="password"
						placeholder="Mật khẩu mới *"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						className={cn(errors.newPassword && 'border-red-500')}
					/>
					{errors.newPassword && (
						<p className="text-sm text-red-500">{errors.newPassword}</p>
					)}
				</div>

				<div className="grid gap-1">
					<Input
						type="password"
						placeholder="Xác nhận mật khẩu mới *"
						value={confirmNewPassword}
						onChange={(e) => setConfirmNewPassword(e.target.value)}
						className={cn(errors.confirmNewPassword && 'border-red-500')}
					/>
					{errors.confirmNewPassword && (
						<p className="text-sm text-red-500">{errors.confirmNewPassword}</p>
					)}
				</div>
			</div>

			<Button
				onClick={handlePasswordChange}
				disabled={isPending}
				className="bg-[#FF8800] hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
			>
				{isPending ? 'ĐANG ĐỔI...' : 'ĐỔI MẬT KHẨU'}
			</Button>

			<PasswordChangedModal
				open={isSuccessModalOpen}
				onClose={() => setIsSuccessModalOpen(false)}
				onLoginClick={() => {
					localStorage.removeItem('access_token');
					setIsAuthenticated(false);
					navigate('/login');
				}}
			/>
		</div>
	);
}
