import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from 'src/modules/auth/auth.module';

import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/services';

import { UserQueryHandlers } from './queries/handlers';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [UsersController],
	providers: [PrismaService, UserRepository, ...UserQueryHandlers],
	exports: [],
})
export class UsersModule {}
