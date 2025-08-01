import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LoginPage from '@/pages/Login.tsx';
import RegisterPage from '@/pages/Register.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppProvider } from '@/components/context/AppContext.tsx';
import ProtectedRoute from '@/components/auth/index.tsx';
import { Toaster } from './components/ui/sonner.tsx';
// import { SocketProvider } from './components/context/socket.context.tsx'
import HomePage from '@/pages/Home.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/layout/Layout.tsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import UpdateProfile from 'pages/UpdateProfile.tsx';
import AccountSettings from 'pages/AccountSetting.tsx';
import { ProfileLayout } from '@/layout/LayoutProfile.tsx';
import AdminLayout from './layout/AdminLayout.tsx';
import AdminDashboard from './pages/admin/Dashboard.tsx';
import UserManagement from './pages/admin/UserManagement.tsx';
import AuthLayout from './layout/AuthLayout.tsx';
import Post from './pages/Post.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <HomePage />,
			},

			{
				path: '/user/settings/profile',
				element: (
					<ProtectedRoute>
						<ProfileLayout>
							<UpdateProfile />
						</ProfileLayout>
					</ProtectedRoute>
				),
			},
			{
				path: '/user/settings/account',
				element: (
					<ProtectedRoute>
						<ProfileLayout>
							<AccountSettings />
						</ProfileLayout>
					</ProtectedRoute>
				),
			},
			{
				path: '/user/posts',
				element: (
					<ProtectedRoute>
						<Post />
					</ProtectedRoute>
				),
			},
		],
	},

	{
		path: '/admin',
		element: <AdminLayout />,
		children: [
			{
				path: 'dashboard',
				element: <AdminDashboard />,
			},
			{
				path: 'users-management',
				element: <UserManagement />,
			},
		],
	},

	{
		element: <AuthLayout />,
		children: [
			{
				path: '/login',
				element: <LoginPage />,
			},
			{
				path: '/register',
				element: <RegisterPage />,
			},
		],
	},
]);
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AppProvider>
				{/* <SocketProvider> */}
				<RouterProvider router={router} />
				<Toaster />
				<ReactQueryDevtools initialIsOpen={false} />

				{/* </SocketProvider> */}
			</AppProvider>
		</QueryClientProvider>
	</StrictMode>,
);
