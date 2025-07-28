import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { BsApple } from 'react-icons/bs';
import { useCurrentApp } from '@/components/context/AppContext';
import { useLogin } from '@/services/query/auth';

export default function LoginForm() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const { setIsAuthenticated } = useCurrentApp();

	const { mutate: login, isPending } = useLogin();

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();

		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

		if (!trimmedEmail || !trimmedPassword) {
			setErrorMessage('Vui lòng điền đầy đủ thông tin');
			setSuccessMessage('');
			return;
		}

		login(
			{ email: trimmedEmail, password: trimmedPassword },
			{
				onSuccess: (res) => {
					if (res.success) {
						localStorage.setItem('access_token', res.data.accessToken);
						setIsAuthenticated(true);
						setSuccessMessage('Đăng nhập thành công!');
						setErrorMessage('');
						setTimeout(() => window.close(), 1500);
					} else {
						setErrorMessage(res.message || 'Đăng nhập thất bại');
						setSuccessMessage('');
					}
				},
				onError: (err: any) => {
					setErrorMessage(err?.response?.data?.message || 'Lỗi đăng nhập');
					setSuccessMessage('');
				},
			},
		);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
			<Card className="w-full max-w-md shadow-lg max-h-[95vh] overflow-auto">
				<CardContent className="p-6 space-y-6">
					{/* Logo */}
					<div className="text-left">
						<img src="/image/logo.png" alt="Chợ Tốt" className="h-8 mb-4" />
					</div>

					{/* Success message */}
					{successMessage && (
						<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
							{successMessage}
						</div>
					)}

					{/* Error message */}
					{errorMessage && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
							{errorMessage}
						</div>
					)}

					{/* Banner */}
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<div className="flex items-start gap-3">
							<img
								src="https://id.chotot.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fstatic-chotot-com%2Fstorage%2Ficons%2Fgif%2Fgift_transparent.gif&w=96&q=75"
								alt="Gift"
								className="w-8 h-8 mt-1 flex-shrink-0"
							/>
							<div className="flex-1">
								<p className="text-sm text-gray-800 leading-relaxed">
									Chưa có tài khoản? Tạo tài khoản để nhận{' '}
									<span className="font-bold underline hover:text-blue-600 cursor-pointer">
										20,000 VND
									</span>{' '}
									(quy đổi 20,000 Đồng Tốt).
								</p>
								<Button
									variant="link"
									className="text-blue-600 p-0 h-auto font-medium text-sm mt-1 hover:no-underline"
									onClick={() => navigate('/register')}
								>
									Tạo tài khoản
								</Button>
							</div>
						</div>
					</div>

					<h2 className="text-xl font-semibold">Đăng nhập</h2>

					{/* Form */}
					<form onSubmit={handleLogin} className="space-y-4">
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
								placeholder="Nhập mật khẩu"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<Button
								variant="link"
								className="text-blue-600 p-0 h-auto text-sm"
								onClick={() => navigate('/forgot-password')}
							>
								Quên mật khẩu?
							</Button>
						</div>

						<Button
							type="submit"
							disabled={isPending}
							className="w-full bg-[#f80] hover:bg-[#ffaa33] text-white transition-colors duration-200"
						>
							{isPending ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
						</Button>
					</form>

					{/* Divider */}
					<div className="relative text-center text-sm text-gray-500 my-4">
						<span className="bg-white px-2 relative z-10">Hoặc đăng nhập bằng</span>
						<div className="absolute top-1/2 left-0 w-full border-t border-gray-200 z-0"></div>
					</div>

					{/* Social Login */}
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
					{/* Register Prompt */}
					<div className="text-center text-sm">
						Chưa có tài khoản?{' '}
						<Button
							variant="link"
							className="text-blue-600 font-medium p-0 h-auto"
							onClick={() => navigate('/register')}
						>
							Đăng ký tài khoản mới
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
