import { JwtService } from '@nestjs/jwt';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';

import * as cookie from 'cookie';
import { Server, Socket } from 'socket.io';
import { jwtConfig } from 'src/configs';
import { NotificationsEntity } from 'src/models';

import { UserRepository } from 'src/modules/users/users.repository';

@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private users = new Map<string, string>();

	constructor(
		private readonly jwtService: JwtService,
		private readonly userRepository: UserRepository,
	) {}

	async handleConnection(client: Socket): Promise<void> {
		const cookies = cookie.parse(client.handshake.headers.cookie || '');
		const accessToken = cookies['accessToken'];

		if (!accessToken) {
			client.disconnect();
			return;
		}

		try {
			const payload = this.jwtService.verify(accessToken, {
				secret: jwtConfig.secretAccessKey,
			});

			const user = await this.userRepository.findUserByUserId(payload.userId);
			if (!user) {
				client.disconnect();
				return;
			}

			this.users.set(user.id, client.id);
		} catch (err) {
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket): void {
		for (const [userId, socketId] of this.users.entries()) {
			if (socketId === client.id) {
				this.users.delete(userId);
				break;
			}
		}
	}

	sendNotification(userId: string, notification: NotificationsEntity): void {
		const socketId = this.users.get(userId);
		if (socketId) {
			this.server.to(socketId).emit('notification', notification);
		}
	}
}
