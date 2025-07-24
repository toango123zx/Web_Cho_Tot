import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from './key';
import { calculatePagesCount } from '../helper';
import { getUsersPaginateAPI } from '@/services/api/user';

export const PAGE_SIZE = 2;

export const useFetchUser = (currentPage: number) => {
	const queryInfo = useQuery({
		queryKey: QUERY_KEY.getUserPaginate(currentPage),
		queryFn: async () => {
			const res = await getUsersPaginateAPI(currentPage, PAGE_SIZE);

			const total_items = Number(res.headers['x-total-count'] ?? 0);
			const totalPages = calculatePagesCount(PAGE_SIZE, total_items);
			const users = res.data ?? [];

			return {
				total_items,
				totalPages,
				users,
			};
		},
		placeholderData: keepPreviousData,
	});

	return {
		...queryInfo,
		data: queryInfo?.data?.users ?? [],
		count: queryInfo?.data?.total_items ?? 0,
		totalPages: queryInfo?.data?.totalPages ?? 0,
	};
};
