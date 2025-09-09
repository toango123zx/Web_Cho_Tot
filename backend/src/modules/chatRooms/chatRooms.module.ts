import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { ChatsRepository } from '../chats/chats.repository';
import { DatabaseModule } from '../database/database.module';

import { UserRepository } from './../users/users.repository';
import { ChatRoomsController } from './chatRooms.controller';
import { ChatRoomsRepository } from './chatRooms.repository';
import { ChatRoomCommandHandlers } from './commands/handlers';
import { ChatRoomQueryHandlers } from './queries/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [ChatRoomsController],
	providers: [
		...ChatRoomQueryHandlers,
		...ChatRoomCommandHandlers,
		UserRepository,
		ChatsRepository,
		ChatRoomsRepository,
	],
	exports: [],
})
export class ChatRoomsModule {}
