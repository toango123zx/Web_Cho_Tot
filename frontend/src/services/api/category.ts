import axios from '@/services/AxiosCustomize';

export const getCategoriesAPI = async (params: { page?: number; limit?: number }) => {
	const res = await axios.get('/categories', { params });

	return res.data as IModelPaginate<ICategory[]>;
};

export const createCategoryAPI = async (data: ICategoryCreation) => {
	const res = await axios.post('/categories', data);

	return res.data as IBackendRes<ICategory>;
};

export const updateCategoryAPI = async (id: string, data: ICategoryUpdate) => {
	const res = await axios.patch(`/categories/${id}`, data);

	return res.data as IBackendRes<ICategory>;
};

export const deleteCategoryAPI = async (id: string) => {
	const res = await axios.delete(`/categories/${id}`);

	return res.data as IBackendRes<ICategory>;
};
