import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { ChatRoomsRepository } from '../chatRooms/chatRooms.repository';
import { DatabaseModule } from '../database/database.module';
import { GatewayModule } from '../gateway/gateway.module';
import { UserRepository } from '../users/users.repository';

import { ChatGateway } from './chat.gateway';
import { ChatsRepository } from './chats.repository';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule, GatewayModule],
	controllers: [],
	providers: [ChatGateway, UserRepository, ChatRoomsRepository, ChatsRepository],
	exports: [ChatGateway],
})
export class ChatsModule {}
