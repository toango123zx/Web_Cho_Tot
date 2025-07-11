import { HeaderBottom } from './header-bottom.component'
import { HeaderTop } from './header-top.component'

export function Header() {
	return (
		<div className='bg-app-primary'>
			<HeaderTop />
			<HeaderBottom />
		</div>
	)
}
