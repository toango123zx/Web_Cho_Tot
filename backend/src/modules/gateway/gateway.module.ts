import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppGateway } from 'src/modules/gateway/app.gateway';

import { DatabaseModule } from '../database/database.module';
import { UserRepository } from '../users/users.repository';

@Module({
	imports: [JwtModule, DatabaseModule],
	providers: [AppGateway, UserRepository],
	exports: [AppGateway],
})
export class GatewayModule {}
