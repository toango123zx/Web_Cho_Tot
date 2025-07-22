import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';

import { UserRepository } from 'src/modules/users/users.repository';

import { DatabaseModule } from '../database/database.module';

import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthCommandHandlers } from './commands/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, JwtModule],
	controllers: [AuthController],
	providers: [UserRepository, AuthRepository, ...AuthCommandHandlers],
	exports: [JwtModule],
})
export class AuthModule {}
