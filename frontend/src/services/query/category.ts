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
