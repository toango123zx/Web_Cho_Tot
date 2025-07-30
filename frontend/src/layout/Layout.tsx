import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import PacmanLoader from 'react-spinners/PacmanLoader';

import { useCurrentApp } from '@/components/context/AppContext';
import { Header } from '../components/commons';
import { useAccount } from '@/services/query/auth';

function Layout() {
	const { user, setUser, setIsAuthenticated, isAppLoading, setIsAppLoading } =
		useCurrentApp();
	const { data, isLoading, refetch } = useAccount();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (data) {
			setUser(data);
			setIsAuthenticated(true);
		} else {
			setUser(null);
			setIsAuthenticated(false);
		}
		setIsAppLoading(isLoading);
	}, [data, isLoading]);

	useEffect(() => {
		const bc = new BroadcastChannel('auth_channel');

		bc.onmessage = (event) => {
			if (event.data === 'logged_in') {
				refetch();
			}
		};

		return () => bc.close();
	}, [refetch]);

	if (isAppLoading) {
		return (
			<div
				style={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				}}
			>
				<PacmanLoader size={30} color="#36d6b4" />
			</div>
		);
	}

	if (user?.role === 'ADMIN') {
		return <Navigate to={'/admin/dashboard'} replace />;
	}

	return (
		<div>
			<Header />
			<Outlet />
		</div>
	);
}

export default Layout;
