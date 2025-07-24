import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { BsApple } from 'react-icons/bs';
import { toast } from 'sonner';
import { useCurrentApp } from '@/components/context/AppContext';
import { useLogin } from '@/config/useLogin';

export default function LoginForm() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { setIsAuthenticated } = useCurrentApp();

	const { mutate: login, isPending } = useLogin();

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();

		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

		if (!trimmedEmail || !trimmedPassword) {
			toast.error('Vui lòng điền đầy đủ thông tin');
			return;
		}

		login(
			{ email: trimmedEmail, password: trimmedPassword },
			{
				onSuccess: (res) => {
					const result = res.data;
					if (result.success && result.data?.accessToken) {
						localStorage.setItem('access_token', result.data.accessToken);
						setIsAuthenticated(true);
						toast.success('Đăng nhập thành công');
						window.close();
					} else {
						toast.error(result.message || 'Đăng nhập thất bại');
					}
				},
				onError: (err: any) => {
					toast.error(err?.response?.data?.message || 'Lỗi đăng nhập');
				},
			},
		);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardContent className="p-6 space-y-6">
					{/* Logo + Banner */}
					<div className="text-center">
						<img src="/image/logo.png" alt="Chợ Tốt" className="h-8 mb-4" />
						<div className="bg-yellow-100 border border-yellow-300 text-sm rounded p-3 flex items-start gap-2">
							<span className="text-xl mt-1">🎁</span>
							<div>
								Chưa có tài khoản? Nhận <b>20,000 VNĐ</b> khi đăng ký.
								<br />
								<Button
									variant="link"
									className="text-blue-600 p-0 h-auto font-medium"
									onClick={() => navigate('/register')}
								>
									Tạo tài khoản
								</Button>
							</div>
						</div>
					</div>

					<form onSubmit={handleLogin} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Nhập email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Mật khẩu</Label>
							<Input
								id="password"
								type="password"
								placeholder="Nhập mật khẩu"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
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
							className="w-full bg-orange-500 hover:bg-orange-600"
						>
							{isPending ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
						</Button>
					</form>

					<div className="relative text-center text-sm text-gray-500">
						<span className="bg-white px-2 relative z-10">Hoặc đăng nhập bằng</span>
						<div className="absolute top-1/2 left-0 w-full border-t border-gray-200 z-0"></div>
					</div>

					<div className="flex flex-wrap gap-2">
						<Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
							<FaFacebook className="mr-2" /> Facebook
						</Button>
						<Button className="flex-1 bg-white border text-black hover:bg-gray-50">
							<FaGoogle className="mr-2" /> Google
						</Button>
						<Button className="flex-1 bg-black text-white hover:bg-gray-900">
							<BsApple className="mr-2" /> Apple
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
