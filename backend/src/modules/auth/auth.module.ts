import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';

import { UserRepository } from 'src/modules/users/users.repository';

import { DatabaseModule } from '../database/database.module';
import { MailModule } from '../mail/mail.module';
import { OtpsModule } from '../otps/otps.module';

import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthCommandHandlers } from './commands/handlers';
import { GoogleOAuthGuard } from './guards';
import { AuthQueryHandlers } from './queries/handlers';
import { GoogleOauthStrategy } from './strategies';

@Module({
	imports: [CqrsModule, DatabaseModule, JwtModule, OtpsModule, MailModule],
	controllers: [AuthController],
	providers: [
		GoogleOauthStrategy,
		GoogleOAuthGuard,
		UserRepository,
		AuthRepository,
		...AuthQueryHandlers,
		...AuthCommandHandlers,
	],
	exports: [JwtModule],
})
export class AuthModule {}
