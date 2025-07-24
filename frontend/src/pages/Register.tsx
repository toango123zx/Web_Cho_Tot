import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { BsApple } from 'react-icons/bs';
import { useRegister } from '@/config/useRegister';

export default function RegisterPage() {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	const { mutate: register, isPending } = useRegister();

	const handleRegister = (e: React.FormEvent) => {
		e.preventDefault();

		const trimmedName = name.trim();
		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

		if (!trimmedName || !trimmedEmail || !trimmedPassword) {
			setErrorMessage('Vui lòng điền đầy đủ thông tin');
			setSuccessMessage('');
			return;
		}

		register(
			{ name: trimmedName, email: trimmedEmail, password: trimmedPassword },
			{
				onSuccess: (res) => {
					const result = res.data;
					if (result.success) {
						setSuccessMessage('Đăng ký thành công!');
						setErrorMessage('');
						setTimeout(() => navigate('/login'), 2000);
					} else {
						setErrorMessage(result.message || 'Đăng ký thất bại');
						setSuccessMessage('');
					}
				},
				onError: (err: any) => {
					setErrorMessage(err?.response?.data?.message || 'Có lỗi xảy ra');
					setSuccessMessage('');
				},
			},
		);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardContent className="p-6 space-y-6">
					<div className="text-left">
						<img src="/image/logo.png" alt="Chợ Tốt" className="h-8 mb-6" />
						<h2 className="text-xl font-semibold">Đăng ký tài khoản</h2>
					</div>

					{errorMessage && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
							<strong className="font-semibold"></strong> {errorMessage}
						</div>
					)}

					{successMessage && (
						<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
							<strong className="font-semibold"></strong> {successMessage}
						</div>
					)}

					<form onSubmit={handleRegister} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Họ và tên</Label>
							<Input
								id="name"
								type="text"
								placeholder="Nhập họ và tên"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Nhập email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Mật khẩu</Label>
							<Input
								id="password"
								type="password"
								placeholder="Tạo mật khẩu"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<Button
							type="submit"
							className="w-full bg-[#f80] hover:bg-[#ffaa33] text-white transition-colors duration-200"
							disabled={isPending}
						>
							{isPending ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
						</Button>
					</form>

					<div className="relative text-center text-sm text-gray-500">
						<span className="bg-white px-2 relative z-10">Hoặc đăng nhập bằng</span>
						<div className="absolute top-1/2 left-0 w-full border-t border-gray-200 z-0"></div>
					</div>

					<div className="flex gap-2 justify-between">
						<Button className="flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 text-white">
							<FaFacebook className="mr-2" /> Facebook
						</Button>
						<Button className="flex-1 min-w-0 bg-white border text-black hover:bg-gray-50">
							<FaGoogle className="mr-2" /> Google
						</Button>
						<Button className="flex-1 min-w-0 bg-black text-white hover:bg-gray-900">
							<BsApple className="mr-2" /> Apple
						</Button>
					</div>

					<div className="text-center text-sm mt-2">
						Đã có tài khoản?&nbsp;
						<Button
							variant="link"
							className="text-blue-600 font-medium p-0 h-auto"
							onClick={() => navigate('/login')}
						>
							Đăng nhập ngay
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
