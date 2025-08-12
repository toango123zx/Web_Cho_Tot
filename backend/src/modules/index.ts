import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ChatRoomsModule } from './chatRooms/chatRooms.module';
import { DatabaseModule } from './database/database.module';
import { HealthCheckModule } from './healthCheck/healthCheck.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

export const Modules = [
	DatabaseModule,
	HealthCheckModule,
	AuthModule,
	UsersModule,
	CategoriesModule,
	PostsModule,
	NotificationsModule,
	ChatRoomsModule,
];
