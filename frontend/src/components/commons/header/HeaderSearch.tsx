import { Button, Input } from '@/components/ui';
import { useClickOutside } from '@/hooks';
import { ChevronDown, MapPin, Search, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import provinceData from '@/json/tree.json';

export function HeaderSearch() {
	const [isProvinceChooserShown, setIsProvinceChooserShown] = useState(false);
	const [provinceSearchText, setProvinceSearchText] = useState('');

	const ref = useRef<HTMLDivElement>(null);

	useClickOutside(ref, () => {
		setIsProvinceChooserShown(false);
	});

	const filteredProvinces = useMemo(() => {
		return provinceData.filter((province) =>
			province.name.toLowerCase().includes(provinceSearchText.toLowerCase()),
		);
	}, [provinceSearchText]);

	const handleToggleProvinceChooser = (e: React.MouseEvent, isShown: boolean) => {
		e.stopPropagation();
		setIsProvinceChooserShown(isShown);
	};

	return (
		<div className="flex-1 py-2 px-2 sm:py-2.5 sm:pl-6 sm:pr-8 w-full">
			<div className="flex items-center bg-white rounded-sm p-1 sm:p-2">
				<div
					onClick={(e) => handleToggleProvinceChooser(e, true)}
					className="flex items-center justify-between w-[100px] cursor-pointer sm:w-[180px] pr-1 sm:pr-2"
				>
					<span className="inline-flex items-center gap-1 text-xs sm:text-sm font-normal">
						<MapPin className="text-app-primary w-4 h-4 sm:w-5 sm:h-5" />
						<span>TP.HCM</span>
					</span>
					<ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
				</div>

				<span className="w-[1px] block h-4 sm:h-6 bg-gray-300 mx-1 sm:mx-2" />

				<div className="pl-1 sm:pl-2 flex-1">
					<input
						type="text"
						placeholder="Tìm kiếm sản phẩm trên Chợ Tốt"
						className="outline-none text-xs sm:text-sm w-full"
					/>
				</div>

				<Button size={'sm'} variant={'app-secondary'} className="p-1 sm:p-2">
					<Search className="w-4 h-4 sm:w-5 sm:h-5" />
				</Button>
			</div>

			{/* Province chooser */}
			{isProvinceChooserShown && (
				<div className="fixed z-10 inset-0 flex justify-center items-center bg-black/30 p-2">
					<div
						ref={ref}
						className="max-w-[480px] max-h-[700px] h-full w-full bg-white p-4 shadow-lg rounded-sm"
					>
						<div className="h-full flex flex-col">
							<div className="flex items-center">
								<X
									className="cursor-pointer"
									onClick={(e) => handleToggleProvinceChooser(e, false)}
								/>
								<span className="flex-1 text-center">Chọn khu vực</span>
							</div>

							<div className="py-4">
								<Input
									value={provinceSearchText}
									onChange={(e) => setProvinceSearchText(e.target.value)}
									placeholder="Tìm tỉnh, thành phố"
									className="py-6"
								/>
							</div>

							<div className="flex flex-1 flex-col overflow-y-auto pb-2">
								{filteredProvinces.map((province) => (
									<label
										key={province.code}
										htmlFor={province.name}
										className="px-4 py-3 hover:bg-gray-200 cursor-pointer inline-flex items-center"
									>
										<span className="flex-1 text-sm">{province.name}</span>
										<input
											type="radio"
											className="accent-app-secondary"
											id={province.name}
											name="province"
										/>
									</label>
								))}
							</div>

							<Button variant={'app-secondary'} size={'lg'}>
								Xác nhận
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
