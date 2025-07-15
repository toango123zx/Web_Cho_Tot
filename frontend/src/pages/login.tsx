import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { FaFacebook, FaGoogle } from 'react-icons/fa'
import { BsApple } from 'react-icons/bs'

export default function LoginForm() {
	const navigate = useNavigate()

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault()
		// TODO: xử lý đăng nhập tại đây
		console.log('Đăng nhập...')
	}

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
			<Card className='w-full max-w-md shadow-lg'>
				<CardContent className='p-6 space-y-6'>
					{/* Logo + Banner */}
					<div className='text-center'>
						<div className='text-left'>
							<img
								src='/image/logo.png'
								alt='Chợ Tốt'
								className='h-8 mb-2'
							/>
						</div>
						<div className='bg-yellow-100 border border-yellow-300 text-sm rounded p-3 flex items-start gap-2'>
							<span className='text-xl mt-1'>🎁</span>
							<div>
								Chưa có tài khoản? Tạo tài khoản để nhận <b>20,000 VNĐ</b> (quy đổi 20,000 Đồng Tốt). <br />
								<Button
									variant='link'
									className='text-blue-600 p-0 h-auto font-medium'
									onClick={() => navigate('/register')}
								>
									Tạo tài khoản
								</Button>
							</div>
						</div>
					</div>

					{/* Form đăng nhập */}
					<form
						onSubmit={handleLogin}
						className='space-y-4'
					>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='Nhập email'
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='password'>Mật khẩu</Label>
							<Input
								id='password'
								type='password'
								placeholder='Nhập mật khẩu'
								required
							/>
							<Button
								type='button'
								variant='link'
								className='text-blue-600 p-0 h-auto text-sm'
								onClick={() => navigate('/forgot-password')}
							>
								Quên mật khẩu?
							</Button>
						</div>

						<Button
							type='submit'
							className='w-full bg-orange-500 hover:bg-orange-600'
						>
							ĐĂNG NHẬP
						</Button>
					</form>

					{/* Hoặc đăng nhập bằng */}
					<div className='relative text-center text-sm text-gray-500'>
						<span className='bg-white px-2 relative z-10'>Hoặc đăng nhập bằng</span>
						<div className='absolute top-1/2 left-0 w-full border-t border-gray-200 z-0'></div>
					</div>

					<div className='flex flex-wrap gap-2'>
						<Button className='flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap overflow-hidden'>
							<FaFacebook className='mr-2 shrink-0' /> Facebook
						</Button>
						<Button className='flex-1 min-w-0 bg-white border hover:bg-gray-50 text-black whitespace-nowrap overflow-hidden'>
							<FaGoogle className='mr-2 shrink-0' /> Google
						</Button>
						<Button className='flex-1 min-w-0 bg-black hover:bg-gray-900 text-white whitespace-nowrap overflow-hidden'>
							<BsApple className='mr-2 shrink-0' /> Apple ID
						</Button>
					</div>
					<div className='text-center text-sm mt-2'>
						Chưa có tài khoản?{' '}
						<Button
							variant='link'
							className='text-blue-600 font-medium p-0 h-auto'
							onClick={() => navigate('/register')}
						>
							Đăng ký tài khoản mới
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
