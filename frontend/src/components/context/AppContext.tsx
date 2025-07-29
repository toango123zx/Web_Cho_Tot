import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { useAccount } from '@/services/query/auth';

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
	const queryClient = useQueryClient();
	const { data, isLoading, refetch } = useAccount();

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
	}, [queryClient]);

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
