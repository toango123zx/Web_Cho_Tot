import ProtectedRoute from '@/components/auth';
import { Sidebar } from '@/components/commons/admin';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
	return (
		<ProtectedRoute>
			<div className="flex h-dvh">
				<Sidebar />
				<main className="flex-1 h-full bg-gray-50 p-6 overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</ProtectedRoute>
	);
}
