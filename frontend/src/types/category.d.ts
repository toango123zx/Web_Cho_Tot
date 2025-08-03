interface ICategory {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

interface ICategoryCreation {
	name: string;
}

interface ICategoryUpdate {
	name: string;
}
