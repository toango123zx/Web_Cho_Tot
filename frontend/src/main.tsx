import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './pages/LoginPage.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage.tsx'
// import { AppProvider } from '@/components/context/app.context.tsx'
// import ProtectedRoute from '@/components/auth/index.tsx'
import { Toaster } from './components/ui/sonner.tsx'
// import { SocketProvider } from './components/context/socket.context.tsx'
import HomePage from './pages/HomePage.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './layout.tsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout />
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ]
  },

])
const queryClient = new QueryClient()


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
)
