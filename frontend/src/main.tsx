import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LoginPage from '@/pages/Login.tsx';
import RegisterPage from '@/pages/Register.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { AppProvider } from '@/components/context/app.context.tsx'
// import ProtectedRoute from '@/components/auth/index.tsx'
import { Toaster } from './components/ui/sonner.tsx';
// import { SocketProvider } from './components/context/socket.context.tsx'
import HomePage from '@/pages/Home.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/layout/Layout.tsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import UpdateProfile from 'pages/UpdateProfile.tsx';
import AccountSettings from 'pages/AccountSetting.tsx';
import { ProfileLayout } from '@/layout/LayoutProfile.tsx';

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
					<ProfileLayout>
						<UpdateProfile />
					</ProfileLayout>
				),
			},
			{
				path: '/user/settings/account',
				element: (
					<ProfileLayout>
						<AccountSettings />
					</ProfileLayout>
				),
			},
		],
	},
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/register',
		element: <RegisterPage />,
	},
]);
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			{/* <AppProvider> */}
			{/* <SocketProvider> */}
			<RouterProvider router={router} />
			<Toaster />
			<ReactQueryDevtools initialIsOpen={false} />

			{/* </SocketProvider> */}
			{/* </AppProvider> */}
		</QueryClientProvider>
	</StrictMode>,
);
