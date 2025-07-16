import { BriefcaseBusiness, ChevronDown } from 'lucide-react'
import { RELATIVE_SITES } from './constants'

export function HeaderTop() {
	return (
		<div className='pl-4 sm:pl-6'>
			<div className='flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4'>
				<ul className='flex flex-wrap gap-2 sm:gap-4'>
					{RELATIVE_SITES.map(site => (
						<li
							className='text-[12px] sm:text-sm font-normal'
							key={site.href}
						>
							<a
								className='text-[12px]'
								href={site.href}
							>
								{site.name}
							</a>
						</li>
					))}
				</ul>

				<div className='flex items-center'>
					<ul className='flex flex-wrap gap-2 sm:gap-4'>
						<li className='text-[12px] font-normal'>Đóng góp ý kiến</li>
						<li className='text-[12px] font-normal'>Tải ứng dụng</li>
						<li className='text-[12px] font-normal'>Trợ giúp</li>
					</ul>

					<div className='inline-flex items-center gap-2 bg-[#FFF4E0] text-[12px] py-2.5 px-3 rounded-bl-lg ml-4 cursor-pointer'>
						<BriefcaseBusiness size={15} />
						<span>Dành cho người bán</span>
						<ChevronDown size={15} />
					</div>
				</div>
			</div>
		</div>
	)
}
