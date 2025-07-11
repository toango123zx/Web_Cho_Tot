import { Button } from '@/components/ui'
import { ChevronDown, MapPin, Search } from 'lucide-react'

export function HeaderSearch() {
	return (
		<div className='flex-1 py-2 px-2 sm:py-2.5 sm:pl-6 sm:pr-8 w-full'>
			<div className='flex items-center bg-white rounded-sm p-1 sm:p-2'>
				<div className='flex items-center justify-between w-[100px] sm:w-[180px] pr-1 sm:pr-2'>
					<span className='inline-flex items-center gap-1 text-xs sm:text-sm font-normal'>
						<MapPin className='text-app-primary w-4 h-4 sm:w-5 sm:h-5' />
						<span>TP.HCM</span>
					</span>
					<ChevronDown className='w-4 h-4 sm:w-5 sm:h-5' />
				</div>

				<span className='w-[1px] block h-4 sm:h-6 bg-gray-300 mx-1 sm:mx-2' />

				<div className='pl-1 sm:pl-2 flex-1'>
					<input
						type='text'
						placeholder='Tìm kiếm sản phẩm trên Chợ Tốt'
						className='outline-none text-xs sm:text-sm w-full'
					/>
				</div>

				<Button
					size={'sm'}
					variant={'app-secondary'}
					className='p-1 sm:p-2'
				>
					<Search className='w-4 h-4 sm:w-5 sm:h-5' />
				</Button>
			</div>
		</div>
	)
}
