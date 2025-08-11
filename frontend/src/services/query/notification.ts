import { QUERY_KEY } from '@/config/key';
import { getNotificationsAPI, readNotificationAPI } from '@/services/api/notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetNotifications = (isAuthenticated: boolean) => {
	const query = useQuery({
		queryKey: QUERY_KEY.getNotifications(),
		queryFn: () => getNotificationsAPI(),
		staleTime: 1000 * 60 * 5,
		enabled: isAuthenticated,
	});

	return query;
};

export const useReadNotificationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => readNotificationAPI(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.getNotifications() });
		},
	});
};
