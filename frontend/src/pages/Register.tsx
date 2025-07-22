import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { BsApple } from 'react-icons/bs';
import { registerAPI } from '@/services/api/auth';
import { toast } from 'sonner';

export default function RegisterPage() {
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();

		const trimmedName = name.trim();
		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

		if (!trimmedName || !trimmedEmail || !trimmedPassword) {
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
			const res = await registerAPI(trimmedName, trimmedEmail, trimmedPassword);
			const result = res.data;

			if (!result.success) {
				toast.error(result.message || 'Đăng ký thất bại');
				return;
			}

			toast.success('Đăng ký thành công!');
			window.opener?.postMessage({ type: 'auth_success' }, window.origin);
			window.close();
		} catch (err: any) {
			toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardContent className="p-6 space-y-6">
					{/* Logo */}
					<div className="text-left">
						<img src="/image/logo.png" alt="Chợ Tốt" className="h-8 mb-8" />
						<h2 className="text-xl font-semibold">Đăng ký tài khoản</h2>
					</div>

					{/* Form */}
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
							className="w-full bg-orange-500 hover:bg-orange-600"
							disabled={loading}
						>
							{loading ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
						</Button>
					</form>

					{/* Mạng xã hội */}
					<div className="relative text-center text-sm text-gray-500">
						<span className="bg-white px-2 relative z-10">Hoặc đăng nhập bằng</span>
						<div className="absolute top-1/2 left-0 w-full border-t border-gray-200 z-0"></div>
					</div>

					<div className="space-y-2">
						<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
							<FaFacebook className="mr-2" /> Facebook
						</Button>
						<Button className="w-full bg-white border hover:bg-gray-50 text-black">
							<FaGoogle className="mr-2" /> Google
						</Button>
						<Button className="w-full bg-black hover:bg-gray-900 text-white">
							<BsApple className="mr-2" /> Apple ID
						</Button>
					</div>

					{/* Chuyển sang login */}
					<div className="text-center text-sm mt-2">
						Đã có tài khoản?
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
