import { Navigate, Outlet } from 'react-router-dom';

import { useCurrentApp } from '@/components/context/AppContext';

export default function AuthLayout() {
	const { isAuthenticated, user } = useCurrentApp();

	if (!isAuthenticated) return <Outlet />;

	if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;

	return <Navigate to="/" replace />;
}
