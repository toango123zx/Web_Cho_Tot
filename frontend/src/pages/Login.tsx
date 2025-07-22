import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { BsApple } from 'react-icons/bs';
import { toast } from 'sonner';
import { loginAPI } from '@/services/api/auth';
import { useCurrentApp } from '@/components/context/AppContext';

export default function LoginForm() {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const { setIsAuthenticated } = useCurrentApp();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

		if (!trimmedEmail || !trimmedPassword) {
			toast.error('Vui lòng điền đầy đủ thông tin');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(trimmedEmail)) {
			toast.error('Email không hợp lệ');
			return;
		}

		setLoading(true);
		try {
			const res = await loginAPI(trimmedEmail, trimmedPassword);
			const result = res.data;

			if (result.success && result.data) {
				localStorage.setItem('access_token', result.data?.accessToken);
				setIsAuthenticated(true);
				toast.success('Đăng nhập thành công');

				window.opener?.postMessage({ type: 'auth_success' }, window.origin);
				window.close();
			} else {
				toast.error(res.data.message || 'Đăng nhập thất bại');
			}
		} catch (err: any) {
			toast.error(err?.response?.data?.message || 'Lỗi đăng nhập');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardContent className="p-6 space-y-6">
					{/* Logo + Banner */}
					<div className="text-center">
						<div className="text-left">
							<img src="/image/logo.png" alt="Chợ Tốt" className="h-8 mb-2" />
						</div>
						<div className="bg-yellow-100 border border-yellow-300 text-sm rounded p-3 flex items-start gap-2">
							<span className="text-xl mt-1">🎁</span>
							<div>
								Chưa có tài khoản? Tạo tài khoản để nhận <b>20,000 VNĐ</b> (quy đổi 20,000
								Đồng Tốt). <br />
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
								type="button"
								variant="link"
								className="text-blue-600 p-0 h-auto text-sm"
								onClick={() => navigate('/forgot-password')}
							>
								Quên mật khẩu?
							</Button>
						</div>

						<Button
							type="submit"
							disabled={loading}
							className="w-full bg-orange-500 hover:bg-orange-600"
						>
							{loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
						</Button>
					</form>

					<div className="relative text-center text-sm text-gray-500">
						<span className="bg-white px-2 relative z-10">Hoặc đăng nhập bằng</span>
						<div className="absolute top-1/2 left-0 w-full border-t border-gray-200 z-0"></div>
					</div>

					<div className="flex flex-wrap gap-2">
						<Button className="flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 text-white">
							<FaFacebook className="mr-2" /> Facebook
						</Button>
						<Button className="flex-1 min-w-0 bg-white border hover:bg-gray-50 text-black">
							<FaGoogle className="mr-2" /> Google
						</Button>
						<Button className="flex-1 min-w-0 bg-black hover:bg-gray-900 text-white">
							<BsApple className="mr-2" /> Apple ID
						</Button>
					</div>

					<div className="text-center text-sm mt-2">
						Chưa có tài khoản?
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
