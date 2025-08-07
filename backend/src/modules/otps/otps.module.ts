import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../database/database.module';

import { OtpsRepository } from './otps.repository';
import { OtpsService } from './services';

@Module({
	imports: [CqrsModule, DatabaseModule],
	controllers: [],
	providers: [OtpsService, OtpsRepository],
	exports: [OtpsService],
})
export class OtpsModule {}
