import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { UserRepository } from './user.repository';

@Module({
	imports: [DatabaseModule],
	controllers: [],
	providers: [UserRepository],
	exports: [],
})
export class UserModule {}
