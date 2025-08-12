import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEY } from '@/config/key';
import {
	changePasswordAPI,
	createUserAPI,
	deleteUserAPI,
	getUsersPaginateAPI,
	updateUserAPI,
} from '../api/user';

interface UserQueryProps {
	page: number;
	limit: number;
	search?: string;
}

export function useUserQueryWithPagination({ page, limit, search }: UserQueryProps) {
	const query = useQuery({
		queryKey: QUERY_KEY.getUserPaginate(page, search || ''),
		queryFn: () => getUsersPaginateAPI(page, limit, search),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	return query;
}

export function useUserMutations() {
	const queryClient = useQueryClient();

	const createUser = useMutation({
		mutationFn: createUserAPI,
		onSuccess: ({ data: res }: any) => {
			if (res.success) {
				toast.success(res.message || 'Tạo người dùng thành công');
				queryClient.invalidateQueries({ queryKey: QUERY_KEY.getAllUser() });
			} else {
				toast.error(res.message || 'Tạo người dùng thất bại');
			}
		},
		onError: (err: any) => {
			const message = err?.response?.data?.message || 'Tạo người dùng thất bại';
			toast.error(message);
			console.error('Create user error:', err);
		},
	});

	const updateUser = useMutation({
		mutationFn: ({ id, data }: { id: string; data: IUserUpdatePayload }) =>
			updateUserAPI(id, data),
		onSuccess: (res: any) => {
			if (res.data.success) {
				toast.success(res.message || 'Cập nhật người dùng thành công');
				queryClient.invalidateQueries({ queryKey: QUERY_KEY.getAllUser() });
			} else {
				toast.error(res.message || 'Cập nhật người dùng thất bại');
			}
		},
		onError: (err: any) => {
			const message = err?.response?.data?.message || 'Cập nhật người dùng thất bại';
			toast.error(message);
			console.error('Update user error:', err);
		},
	});

	const deleteUser = useMutation({
		mutationFn: deleteUserAPI,
		onSuccess: (res: any) => {
			if (res.data.success) {
				toast.success(res.message || 'Xoá người dùng thành công');
				queryClient.invalidateQueries({ queryKey: QUERY_KEY.getAllUser() });
			} else {
				toast.error(res.message || 'Xoá người dùng thất bại');
			}
		},
		onError: (err: any) => {
			const message = err?.response?.data?.message || 'Xoá người dùng thất bại';
			toast.error(message);
			console.error('Delete user error:', err);
		},
	});

	return { createUser, updateUser, deleteUser };
}

export const useChangePassword = () => {
	return useMutation({
		mutationFn: (data: { currentPassword: string; newPassword: string }) =>
			changePasswordAPI(data),
	});
};

export const useUpdateUserProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: IUserUpdatePayload }) =>
			updateUserAPI(id, data),
		onSuccess: (res: any) => {
			if (res.data.success) {
				toast.success(res.message || 'Cập nhật người dùng thành công');
				queryClient.invalidateQueries({ queryKey: ['account'] });
			} else {
				toast.error(res.message || 'Cập nhật người dùng thất bại');
			}
		},
		onError: (err: any) => {
			const message = err?.response?.data?.message || 'Cập nhật người dùng thất bại';
			toast.error(message);
			console.error('Update user error:', err);
		},
	});
};
