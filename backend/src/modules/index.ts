import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';
import { HealthCheckModule } from './healthCheck/healthCheck.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

export const Modules = [
	DatabaseModule,
	HealthCheckModule,
	AuthModule,
	UsersModule,
	CategoriesModule,
	PostsModule,
];
