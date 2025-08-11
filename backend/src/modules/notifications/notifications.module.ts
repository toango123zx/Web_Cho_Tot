import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AppGateway } from 'src/gateway/app.gateway';
import { AuthModule } from 'src/modules/auth/auth.module';

import { UserRepository } from 'src/modules/users/users.repository';

import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';

import { NotificationCommandHandlers } from './commands/handlers';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, UsersModule, AuthModule],
	controllers: [NotificationsController],
	providers: [
		AppGateway,
		NotificationsRepository,
		UserRepository,
		...NotificationsQueryHandlers,
		...NotificationCommandHandlers,
	],
	exports: [],
})
export class NotificationsModule {}
