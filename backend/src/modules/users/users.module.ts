import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from 'src/modules/auth/auth.module';
import { UserCommandHandlers } from 'src/modules/users/commands/handlers';

import { AuthRepository } from 'src/modules/auth/auth.repository';

import { DatabaseModule } from '../database/database.module';

import { UserQueryHandlers } from './queries/handlers';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [UsersController],
	providers: [
		UserRepository,
		AuthRepository,
		...UserQueryHandlers,
		...UserCommandHandlers,
	],
	exports: [],
})
export class UsersModule {}
