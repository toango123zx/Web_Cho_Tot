import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';

import { UserRepository } from './../users/users.repository';
import { ChatRoomsController } from './chatRooms.controller';
import { ChatRoomsRepository } from './chatRooms.repository';
import { ChatRoomCommandHandlers } from './commands/handlers';

@Module({
	imports: [CqrsModule, DatabaseModule, AuthModule],
	controllers: [ChatRoomsController],
	providers: [...ChatRoomCommandHandlers, UserRepository, ChatRoomsRepository],
	exports: [],
})
export class ChatRoomsModule {}
