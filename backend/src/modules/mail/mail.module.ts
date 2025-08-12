import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { MailService } from './services';

@Module({
	imports: [CqrsModule],
	controllers: [],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
