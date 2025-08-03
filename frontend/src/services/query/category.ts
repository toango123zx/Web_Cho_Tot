// src/services/query/category.query.ts

import { QUERY_KEY } from '@/config/key';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
	createCategoryAPI,
	deleteCategoryAPI,
	getCategoriesAPI,
	updateCategoryAPI,
} from '../api/category';

interface CategoryQueryProps {
	page: number;
	limit: number;
}

export const useGetCategories = ({ page, limit }: CategoryQueryProps) => {
	const query = useQuery({
		queryKey: QUERY_KEY.getCategoryPaginate(page),
		queryFn: () => getCategoriesAPI({ page, limit }),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	return query;
};
export const useCategories = () => {
	return useQuery<ICategory[] | null, Error>({
		queryKey: QUERY_KEY.getAllCategories(),
		queryFn: async () => {
			const res = await getCategoriesAPI({});
			return res.success ? res.data : null;
		},
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
	});
};

export const useCategoryMutations = () => {
	const createCategory = useMutation({
		mutationFn: (data: ICategoryCreation) => createCategoryAPI(data),
	});

	const updateCategory = useMutation({
		mutationFn: ({ id, data }: { id: string; data: ICategoryUpdate }) =>
			updateCategoryAPI(id, data),
	});

	const deleteCategory = useMutation({
		mutationFn: (id: string) => deleteCategoryAPI(id),
	});

	return { createCategory, updateCategory, deleteCategory };
};
