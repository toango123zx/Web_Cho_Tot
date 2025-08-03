import axios from '@/services/AxiosCustomize';

export const getCategoriesAPI = async (params: { page?: number; limit?: number }) => {
	const res = await axios.get('/categories', { params });

<<<<<<< HEAD
	return res.data as IModelPaginate<ICategory[]>;
};

export const createCategoryAPI = async (data: ICategoryCreation) => {
	const res = await axios.post('/categories', data);

	return res.data as IBackendRes<ICategory>;
};

export const updateCategoryAPI = async (id: string, data: ICategoryUpdate) => {
	const res = await axios.patch(`/categories/${id}`, data);

	return res.data as IBackendRes<ICategory>;
=======
	return res.data as IModelPaginate<Category[]>;
};

export const createCategoryAPI = async (data: CategoryCreation) => {
	const res = await axios.post('/categories', data);

	return res.data as IBackendRes<Category>;
};

export const updateCategoryAPI = async (id: string, data: CategoryUpdate) => {
	const res = await axios.patch(`/categories/${id}`, data);

	return res.data as IBackendRes<Category>;
>>>>>>> 090ce3484e00035ee792567e581410ac8561a8b0
};

export const deleteCategoryAPI = async (id: string) => {
	const res = await axios.delete(`/categories/${id}`);

<<<<<<< HEAD
	return res.data as IBackendRes<ICategory>;
=======
	return res.data as IBackendRes<Category>;
>>>>>>> 090ce3484e00035ee792567e581410ac8561a8b0
};
