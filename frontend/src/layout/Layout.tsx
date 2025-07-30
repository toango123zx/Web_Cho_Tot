import { Navigate, Outlet } from 'react-router-dom';

import { useCurrentApp } from '@/components/context/AppContext';
import { Header } from '../components/commons';

function Layout() {
	const { user } = useCurrentApp();

	if (user?.role === 'ADMIN') return <Navigate to={'/admin/dashboard'} replace />;

	return (
		<div>
			<Header />
			<Outlet />
		</div>
	);
}

export default Layout;
