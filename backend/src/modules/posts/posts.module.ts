import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from 'src/modules/auth/auth.module';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';

import { CategoriesRepository } from 'src/modules/categories/categories.repository';
import { UserRepository } from 'src/modules/users/users.repository';

import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';

import { PostsCommandHandlers } from './commands/handlers';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, UsersModule, AuthModule, NotificationsModule],
	controllers: [PostsController],
	providers: [
		PostsRepository,
		UserRepository,
		CategoriesRepository,
		...PostsQueryHandlers,
		...PostsCommandHandlers,
	],
	exports: [],
})
export class PostsModule {}
