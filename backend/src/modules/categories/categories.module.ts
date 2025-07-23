import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from 'src/modules/auth/auth.module';

import { UserRepository } from 'src/modules/users/users.repository';

import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';

import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { CategoriesCommandHandlers } from './commands/handlers';
import { CategoriesQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, UsersModule, AuthModule],
	controllers: [CategoriesController],
	providers: [
		CategoriesRepository,
		UserRepository,
		...CategoriesQueryHandlers,
		...CategoriesCommandHandlers,
	],
	exports: [],
})
export class CategoriesModule {}
