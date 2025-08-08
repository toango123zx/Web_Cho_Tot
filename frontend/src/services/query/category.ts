import { QUERY_KEY } from '@/config/key';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import {
	createCategoryAPI,
	deleteCategoryAPI,
	getCategoriesAPI,
	updateCategoryAPI,
} from '../api/category';

interface CategoryQueryProps {
	page: number;
	limit: number;
	search?: string;
}

export const useGetCategories = ({ page, limit, search }: CategoryQueryProps) => {
	const query = useQuery({
		queryKey: QUERY_KEY.getCategoryPaginate(page, search),
		queryFn: () => getCategoriesAPI({ page, limit, search }),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	return query;
};

export const useInfiniteCategoriesQuery = ({
	search,
	limit = 10,
}: {
	search?: string;
	limit?: number;
}) => {
	return useInfiniteQuery({
		queryKey: QUERY_KEY.getCategoryInfinite({ search, limit }),
		queryFn: ({ pageParam = 1 }) => getCategoriesAPI({ page: pageParam, limit, search }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (!lastPage.success) return undefined;
			const { pagination } = lastPage;

			return pagination.currentPage < pagination.totalPages
				? pagination.currentPage + 1
				: undefined;
		},
	});
};

export const useGetAllCategories = () => {
	const query = useQuery({
		queryKey: QUERY_KEY.getAllCategories(),
		queryFn: () => getCategoriesAPI({ page: 1, limit: 1000 }),
		staleTime: 1000 * 60 * 10, // 10 minutes
	});

	return query;
};

export const useCategoryMutations = () => {
	const createCategory = useMutation({
		mutationFn: (data: CategoryCreation) => createCategoryAPI(data),
	});

	const updateCategory = useMutation({
		mutationFn: ({ id, data }: { id: string; data: CategoryUpdate }) =>
			updateCategoryAPI(id, data),
	});

	const deleteCategory = useMutation({
		mutationFn: (id: string) => deleteCategoryAPI(id),
	});

	return { createCategory, updateCategory, deleteCategory };
};
