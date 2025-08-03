interface Category {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

interface CategoryCreation {
	name: string;
}

interface CategoryUpdate {
	name: string;
}
