interface AccountLayerProps {
	accountLayerRef: React.RefObject<HTMLDivElement | null>
}

export function AccountLayer({ accountLayerRef }: AccountLayerProps) {
	return (
		<div
			ref={accountLayerRef}
			className='absolute top-[calc(100%+30px)] right-0 w-[300px] bg-white py-2'
		>
			<div className='flex items-center gap-3 p-3'>
				<img
					src='https://static.chotot.com/storage/marketplace/common/png/default_user.png'
					alt='User Avatar'
					className='size-12'
				/>
				<p className='text-lg font-bold'>Đăng nhập / Đăng ký</p>
			</div>

			<div>
				<p>Quản lí đơn hàng</p>
				<span>
					<span>Đơn mua</span>
				</span>
			</div>
		</div>
	)
}
