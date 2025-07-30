import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEY } from '@/config/key';
import { loginAPI } from '../api/auth';
import {
	createUserAPI,
	deleteUserAPI,
	getUsersPaginateAPI,
	updateUserAPI,
} from '../api/user';

interface UserQueryProps {
	page: number;
	limit: number;
}

export function useUserQueryWithPagination({ page, limit }: UserQueryProps) {
	const query = useQuery({
		queryKey: QUERY_KEY.getUserPaginate(page),
		queryFn: () => getUsersPaginateAPI(page, limit),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	return query;
}

export function useUserMutations() {
	const queryClient = useQueryClient();

	const createUser = useMutation({
		mutationFn: createUserAPI,
		onSuccess: () => {
			toast.success('Tạo người dùng thành công');
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.getAllUser() });
		},
		onError: () => toast.error('Tạo người dùng thất bại'),
	});

	const updateUser = useMutation({
		mutationFn: ({ id, data }: { id: string; data: IUserUpdatePayload }) =>
			updateUserAPI(id, data),
		onSuccess: () => {
			toast.success('Cập nhật người dùng thành công');
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.getAllUser() });
		},
		onError: () => toast.error('Cập nhật người dùng thất bại'),
	});

	const deleteUser = useMutation({
		mutationFn: deleteUserAPI,
		onSuccess: () => {
			toast.success('Xoá người dùng thành công');
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.getAllUser() });
		},
		onError: () => toast.error('Xoá người dùng thất bại'),
	});

	return { createUser, updateUser, deleteUser };
}
