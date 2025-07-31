import {
	CategoryDetail,
	CategoryTable,
	CreateOrUpdateCategoryForm,
} from '@/components/commons/admin';
import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function CategoriesPage() {
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
	const [formOpen, setFormOpen] = useState(false);
	const [detailOpen, setDetailOpen] = useState(false);

	const handleEdit = (category: Category) => {
		setSelectedCategory(category);
		setFormOpen(true);
	};

	const handleView = (category: Category) => {
		setSelectedCategory(category);
		setDetailOpen(true);
	};

	// const handleFormSuccess = async (data: CategoryCreation | CategoryUpdate) => {
	// 	try {
	// 		if (selectedCategory) {
	// 			await updateCategory.mutateAsync({
	// 				id: selectedCategory.id,
	// 				data: data as CategoryUpdate,
	// 			});
	// 			toast.success('Cập nhật danh mục thành công');
	// 		} else {
	// 			await createCategory.mutateAsync(data as CategoryCreation);
	// 			toast.success('Thêm danh mục thành công');
	// 		}
	// 		setFormOpen(false);
	// 		setSelectedCategory(null);
	// 	} catch (error: any) {
	// 		toast.error(error?.message || 'Có lỗi xảy ra');
	// 	}
	// };

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Quản lý danh mục</h1>
				<Button onClick={() => setFormOpen(true)}>
					<Plus className="w-4 h-4 mr-2" />
					Thêm danh mục
				</Button>
			</div>

			<CategoryTable onEdit={handleEdit} onView={handleView} />

			<CreateOrUpdateCategoryForm
				open={formOpen}
				initialData={selectedCategory}
				onClose={() => {
					setFormOpen(false);
					setSelectedCategory(null);
				}}
				onSuccess={() => {}}
			/>

			<CategoryDetail
				open={detailOpen}
				category={selectedCategory}
				onClose={() => {
					setDetailOpen(false);
					setSelectedCategory(null);
				}}
				onEdit={(category) => {
					setDetailOpen(false);
					handleEdit(category);
				}}
			/>
		</div>
	);
}
