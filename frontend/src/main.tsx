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
import PostManagement from './pages/admin/PostManagement.tsx';
import CategoryManagement from './pages/admin/CategoryManagement.tsx';
import CreatePost from './pages/CreatePost.tsx';
import ProductDetailPage from './pages/ProductDetailPage.tsx';
import ManagePost from './pages/ManagePost.tsx';
import UpdatePost from './pages/UpdatePost.tsx';
import SavedPostsPage from './pages/SavedPostsPage.tsx';

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
				path: '/post',
				element: (
					<ProtectedRoute>
						<CreatePost />
					</ProtectedRoute>
				),
			},
			{
				path: '/post/:id',
				element: <ProductDetailPage />,
			},
			{
				path: '/manage-post',
				element: (
					<ProtectedRoute>
						<ManagePost />
					</ProtectedRoute>
				),
			},
			{
				path: '/update-post/:id',
				element: (
					<ProtectedRoute>
						<UpdatePost />
					</ProtectedRoute>
				),
			},
			{
				path: '/saved-posts',
				element: (
					<ProtectedRoute>
						<SavedPostsPage />
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
			{
				path: 'posts-management',
				element: <PostManagement />,
			},
			{
				path: 'categories-management',
				element: <CategoryManagement />,
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
