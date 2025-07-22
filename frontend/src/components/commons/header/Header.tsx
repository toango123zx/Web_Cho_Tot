import { HeaderBottom } from './HeaderBottom'
import { HeaderTop } from './HeaderTop'

export function Header() {
	return (
		<div className='bg-app-primary'>
			<HeaderTop />
			<HeaderBottom />
		</div>
	)
}
