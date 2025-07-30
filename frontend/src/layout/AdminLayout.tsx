import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import ProtectedRoute from '@/components/auth';
import { Sidebar } from '@/components/commons/admin';
import { useCurrentApp } from '@/components/context/AppContext';
import { Button } from '@/components/ui';

export default function AdminLayout() {
	const { user } = useCurrentApp();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	if (user?.role === 'USER') return <Navigate to="/" replace />;

	return (
		<ProtectedRoute>
			<div className="flex h-dvh relative">
				{/* Overlay for mobile/tablet */}
				<div
					className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
						isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
					}`}
					onClick={() => setIsSidebarOpen(false)}
				/>

				{/* Sidebar */}
				<div
					className={`fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:transform-none ${
						isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
					}`}
				>
					<Sidebar />
				</div>

				{/* Main content */}
				<div className="flex-1 flex flex-col min-w-0">
					{/* Mobile header */}
					<div className="sticky top-0 z-10 bg-white border-b px-4 py-2 lg:hidden">
						<Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(true)}>
							<Menu className="h-5 w-5" />
						</Button>
					</div>

					<main className="flex-1 h-full bg-gray-50 p-4 lg:p-6 overflow-y-auto">
						<Outlet />
					</main>
				</div>
			</div>
		</ProtectedRoute>
	);
}
