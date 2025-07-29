import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Lock } from 'lucide-react';

interface PasswordChangedModalProps {
	open: boolean;
	onClose: () => void;
	onLoginClick: () => void;
}

export function PasswordChangedModal({
	open,
	onClose,
	onLoginClick,
}: PasswordChangedModalProps) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent
				className="text-center max-w-sm rounded-xl [&>button.absolute]:hidden"
				onInteractOutside={(e) => e.preventDefault()}
			>
				{' '}
				<div className="flex justify-center mb-4">
					<div className="bg-yellow-400 p-4 rounded-full">
						<Lock className="text-white w-8 h-8" />
					</div>
				</div>
				<h3 className="text-3xl font-semibold">Đổi mật khẩu mới thành công</h3>
				<p className="text-sm mt-1 mb-4 text-[#222222]">
					Giờ đây bạn đã có thể đăng nhập Chợ Tốt với mật khẩu mới.
				</p>
				<Button
					className="w-full bg-[#FF8800] hover:bg-orange-600"
					onClick={onLoginClick}
				>
					ĐĂNG NHẬP
				</Button>
			</DialogContent>
		</Dialog>
	);
}
