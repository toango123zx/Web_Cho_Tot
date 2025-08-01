'use client';

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
import { Camera, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AddressDialog } from '@/components/dialog/AddressDialog';

export default function ProductListingPage() {
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [age, setAge] = useState('');
	const [size, setSize] = useState('');
	const [address, setAddress] = useState<{
		province: string;
		ward: string;
		specificAddress: string;
	} | null>(null);
	const [showAddressDialog, setShowAddressDialog] = useState(false);

	const [errors, setErrors] = useState<{
		title?: string;
		description?: string;
		age?: string;
		size?: string;
		price?: string;
		address?: string;
	}>({});

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			setSelectedImages(Array.from(files));
		}
	};

	const validateForm = () => {
		const newErrors: typeof errors = {};

		if (!title.trim()) {
			newErrors.title = 'Vui lòng điền tiêu đề';
		}
		const wordCount = description.trim().split(/\s+/).length;
		if (!description.trim() || wordCount < 10) {
			newErrors.description = 'Vui lòng nhập ít nhất 10 từ';
		}
		if (!age) {
			newErrors.age = 'Vui lòng chọn độ tuổi';
		}
		if (!size) {
			newErrors.size = 'Vui lòng chọn kích cỡ';
		}
		if (!price.trim() || isNaN(Number(price))) {
			newErrors.price = 'Vui lòng nhập giá bán hợp lệ';
		}
		if (!address || !address.province || !address.ward) {
			newErrors.address = 'Vui lòng chọn đầy đủ địa chỉ';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			console.log('Submit with:', { title, description, price, age, size, address });
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 py-6">
			<div className="container mx-auto max-w-4xl px-4">
				<Alert className="mb-4 border-red-200 bg-red-50">
					<AlertTriangle className="h-4 w-4 text-red-600" />
					<AlertDescription className="text-red-800">
						Vui lòng điền đầy đủ thông tin trước khi chọn XEM TRƯỚC
					</AlertDescription>
				</Alert>

				<div className="bg-white p-4 rounded-lg shadow-sm">
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-4">
						<div className="space-y-3">
							<h3 className="text-lg font-semibold mb-2">Hình ảnh và Video sản phẩm</h3>
							<div className="border-2 border-dashed border-orange-300 rounded-lg p-4 bg-gray-50 w-[320px]">
								<div className="flex flex-col items-center space-y-3">
									<div className="flex items-center space-x-2 text-blue-600 text-sm">
										<Info className="w-4 h-4" />
										<span>Hình ảnh hợp lệ</span>
									</div>
									<div className="w-20 h-20 border-2 border-dashed border-orange-300 rounded-lg flex items-center justify-center">
										<Camera className="w-8 h-8 text-orange-400" />
									</div>
									<p className="text-gray-600 text-sm text-center">
										ĐĂNG TỪ 01 ĐẾN 06 HÌNH
									</p>
								</div>
							</div>
							<input
								type="file"
								multiple
								accept="image/*"
								onChange={handleImageUpload}
								className="hidden"
								id="file-upload"
							/>
						</div>

						<div className="space-y-4 -ml-4">
							<div>
								<Label htmlFor="category" className="text-sm font-medium">
									Danh Mục Tin Đăng *
								</Label>
								<Select>
									<SelectTrigger className="mt-2 w-full">
										<SelectValue placeholder="Thú cưng - Chó" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="pets-dogs">Thú cưng - Chó</SelectItem>
										<SelectItem value="pets-cats">Thú cưng - Mèo</SelectItem>
										<SelectItem value="electronics">Điện tử</SelectItem>
										<SelectItem value="fashion">Thời trang</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-4 mt-12">Thông tin chi tiết</h3>
								<div className="space-y-3">
									<div>
										<Label htmlFor="age" className="text-sm">
											Độ tuổi *
										</Label>
										<Select onValueChange={(value) => setAge(value)}>
											<SelectTrigger className="mt-2 w-full" id="age">
												<SelectValue placeholder="Chọn độ tuổi" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="PUPPY">Chó con</SelectItem>
												<SelectItem value="YOUNG_DOG">Chó nhỏ</SelectItem>
												<SelectItem value="ADULT_DOG">Chó trưởng thành</SelectItem>
												<SelectItem value="OTHER">Khác</SelectItem>
											</SelectContent>
										</Select>
										{errors.age && (
											<p className="text-sm text-red-600 mt-1">{errors.age}</p>
										)}
									</div>
									<div>
										<Label htmlFor="size" className="text-sm">
											Kích cỡ thú cưng *
										</Label>
										<Select onValueChange={(value) => setSize(value)}>
											<SelectTrigger className="mt-2 w-full" id="size">
												<SelectValue placeholder="Chọn kích cỡ" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="MINI">Mini</SelectItem>
												<SelectItem value="SMALL">Nhỏ</SelectItem>
												<SelectItem value="MEDIUM">Vừa</SelectItem>
												<SelectItem value="LARGE">Lớn</SelectItem>
											</SelectContent>
										</Select>
										{errors.size && (
											<p className="text-sm text-red-600 mt-1">{errors.size}</p>
										)}
									</div>
									<div>
										<Label htmlFor="price" className="text-sm">
											Giá bán *
										</Label>
										<Input
											id="price"
											className="mt-1"
											value={price}
											onChange={(e) => setPrice(e.target.value)}
										/>
										{errors.price && (
											<p className="text-sm text-red-600 mt-1">{errors.price}</p>
										)}
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-4 mt-12">
									Tiêu đề tin đăng và Mô tả chi tiết
								</h3>
								<div className="space-y-4">
									<div>
										<Label htmlFor="post-title" className="text-sm">
											Tiêu đề tin đăng *
										</Label>
										<Input
											id="post-title"
											value={title}
											onChange={(e) => setTitle(e.target.value)}
											className={`mt-1 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
											maxLength={50}
										/>
										{errors.title && (
											<p className="text-sm text-red-600 mt-1">{errors.title}</p>
										)}
										<p className="text-xs text-gray-400 mt-1">{title.length}/50 kí tự</p>
									</div>
									<div>
										<Label htmlFor="detailed-description" className="text-sm">
											Mô tả chi tiết *
										</Label>
										<textarea
											id="detailed-description"
											placeholder="Mô tả chi tiết về sản phẩm của bạn..."
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											className={`w-full min-h-[100px] max-h-[150px] resize-y overflow-y-auto border rounded-md px-3 py-2 mt-1 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
											maxLength={1500}
										/>
										{errors.description && (
											<p className="text-sm text-red-600 mt-1">{errors.description}</p>
										)}
										<p className="text-xs text-gray-400 mt-1">
											{description.length}/1500 kí tự
										</p>
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-4 pb-2 mt-12">
									Thông tin người bán
								</h3>
								<div className="space-y-3">
									<Label htmlFor="location" className="text-sm">
										Khu vực *
									</Label>
									<div
										className="mt-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50"
										onClick={() => setShowAddressDialog(true)}
									>
										{address ? (
											<p className="text-sm">
												{address.specificAddress}, {address.ward}, {address.province}
											</p>
										) : (
											<p className="text-gray-400 text-sm">Chọn địa chỉ</p>
										)}
									</div>
									{errors.address && (
										<p className="text-sm text-red-600 mt-1">{errors.address}</p>
									)}
								</div>
							</div>

							<div className="flex justify-end space-x-4 pt-4">
								<Button
									variant="outline"
									className="px-6 border-gray-500 text-gray-500 hover:bg-gray-100"
								>
									Hủy
								</Button>
								<Button
									onClick={handleSubmit}
									className="bg-orange-500 hover:bg-orange-600 px-6"
								>
									Đăng tin
								</Button>
							</div>
						</div>
					</div>
				</div>

				{showAddressDialog && (
					<AddressDialog
						isOpen={showAddressDialog}
						onClose={() => setShowAddressDialog(false)}
						onSave={(value: {
							province: string;
							ward: string;
							specificAddress: string;
						}) => {
							setAddress(value);
							setShowAddressDialog(false);
						}}
						initialAddress={address || undefined}
					/>
				)}
			</div>
		</div>
	);
}
