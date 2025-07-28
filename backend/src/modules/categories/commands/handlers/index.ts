import { CreateCategoryHandler } from './createCategory.handler';
import { DeleteCategoryHandler } from './deleteCategory.handler';
import { UpdateCategoryHandler } from './updateCategory.handler';

export const CategoriesCommandHandlers = [
	CreateCategoryHandler,
	UpdateCategoryHandler,
	DeleteCategoryHandler,
];
