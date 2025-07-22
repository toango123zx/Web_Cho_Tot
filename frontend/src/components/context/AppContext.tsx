import { fetchAccountAPI } from '@/services/api/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { toast } from 'sonner';

interface IAppContext {
	isAuthenticated: boolean;
	setIsAuthenticated: (v: boolean) => void;
	setUser: (v: IUser | null) => void;
	user: IUser | null;
	isAppLoading: boolean;
	setIsAppLoading: (v: boolean) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
	children: React.ReactNode;
};

export const AppProvider = (props: TProps) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState<IUser | null>(null);
	const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
	useEffect(() => {
		const fetchAccount = async () => {
			const accessToken = localStorage.getItem('access_token');
			if (!accessToken) {
				setIsAppLoading(false);
				return;
			}

			try {
				const res = await fetchAccountAPI();
				const result = res.data;

				if (result.success && result.data) {
					setUser(result.data);
					setIsAuthenticated(true);
				} else {
					toast.error(result.message || 'Lấy thông tin tài khoản thất bại');
				}
			} catch (err: any) {
				toast.error(err?.response?.data?.message || 'Có lỗi khi fetch account');
			} finally {
				setIsAppLoading(false);
			}
		};

		fetchAccount();

		const handleMessage = (event: MessageEvent) => {
			if (event.origin !== window.origin) return;
			if (event.data?.type === 'auth_success') {
				fetchAccount();
			}
		};

		window.addEventListener('message', handleMessage);

		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, []);

	return (
		<>
			{isAppLoading === false ? (
				<CurrentAppContext.Provider
					value={{
						isAuthenticated,
						setIsAuthenticated,
						user,
						setUser,
						isAppLoading,
						setIsAppLoading,
					}}
				>
					{props.children}
				</CurrentAppContext.Provider>
			) : (
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
			)}
		</>
	);
};

export const useCurrentApp = () => {
	const currentAppContext = useContext(CurrentAppContext);

	if (!currentAppContext) {
		throw new Error('useCurrentApp has to be used within <CurrentAppContext.Provider>');
	}

	return currentAppContext;
};
