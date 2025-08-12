import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import addressData from '@/json/tree.json';

type AddressDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	onSave: (address: {
		province: string;
		provinceLabel: string;
		ward: string;
		wardLabel: string;
		specificAddress: string;
	}) => void;
	initialAddress?: {
		province: string;
		ward: string;
		specificAddress: string;
	};
};

export function AddressDialog({
	isOpen,
	onClose,
	onSave,
	initialAddress,
}: AddressDialogProps) {
	const [province, setProvince] = useState(initialAddress?.province || '');
	const [ward, setWard] = useState(initialAddress?.ward || '');
	const [specificAddress, setSpecificAddress] = useState(
		initialAddress?.specificAddress || '',
	);

	const selectedProvince = addressData.find((p) => p.code === province);
	const selectedWards = selectedProvince?.wards ?? [];

	const handleSave = () => {
		const provinceLabel = selectedProvince?.name ?? '';
		const wardLabel = selectedWards.find((w) => w.code === ward)?.name ?? '';
		onSave({ province, provinceLabel, ward, wardLabel, specificAddress });
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px] p-6">
				<DialogHeader>
					<DialogTitle className="text-center text-xl font-semibold">Địa chỉ</DialogTitle>
					<button
						onClick={onClose}
						className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none cursor-pointer"
					>
						<X className="h-4 w-4" />
						<span className="sr-only">Close</span>
					</button>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					{/* Province */}
					<div className="grid gap-2">
						<Label htmlFor="province" className="text-sm font-medium text-gray-700 block">
							Tỉnh, Thành phố *
						</Label>
						<Select
							onValueChange={(value) => {
								setProvince(value);
								setWard('');
							}}
							value={province}
						>
							<SelectTrigger id="province" className="w-full">
								<SelectValue placeholder="Chọn Tỉnh, Thành phố" />
							</SelectTrigger>
							<SelectContent>
								{addressData.map((p) => (
									<SelectItem key={p.code} value={p.code}>
										{p.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Ward */}
					<div className="grid gap-2">
						<Label htmlFor="ward" className="text-sm font-medium text-gray-700 block">
							Phường, Xã, Thị trấn *
						</Label>
						<Select onValueChange={setWard} value={ward} disabled={!province}>
							<SelectTrigger id="ward" className="w-full">
								<SelectValue placeholder="Chọn Phường, Xã, Thị trấn" />
							</SelectTrigger>
							<SelectContent>
								{selectedWards.length > 0 ? (
									selectedWards.map((w) => (
										<SelectItem key={w.code} value={w.code}>
											{w.name}
										</SelectItem>
									))
								) : (
									<div className="px-4 py-2 text-sm text-muted-foreground">
										Vui lòng chọn Tỉnh, Thành phố trước
									</div>
								)}
							</SelectContent>
						</Select>
					</div>

					{/* Specific address */}
					<div className="grid gap-2">
						<Label
							htmlFor="specific-address"
							className="text-sm font-medium text-gray-700 block"
						>
							Địa chỉ cụ thể
						</Label>
						<Input
							id="specific-address"
							placeholder="Địa chỉ cụ thể"
							value={specificAddress}
							onChange={(e) => setSpecificAddress(e.target.value)}
						/>
					</div>
				</div>
				<Button
					onClick={handleSave}
					disabled={!province || !ward}
					className="w-full bg-[#FF8800] hover:bg-orange-600 text-white py-2 rounded-md font-semibold"
				>
					XONG
				</Button>
			</DialogContent>
		</Dialog>
	);
}
