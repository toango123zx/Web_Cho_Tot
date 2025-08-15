import { JwtService } from '@nestjs/jwt';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';

import * as cookie from 'cookie';
import { Server, Socket } from 'socket.io';
import { commonAppConfig, jwtConfig } from 'src/configs';
import { NotificationsEntity } from 'src/models';

import { UserRepository } from 'src/modules/users/users.repository';

@WebSocketGateway({ cors: commonAppConfig.corsOrigin })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private connectedUsers = new Map<string, Set<string>>();
	private socketToUser = new Map<string, string>();

	constructor(
		private readonly jwtService: JwtService,
		private readonly userRepository: UserRepository,
	) {}

	afterInit(): void {}

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

			if (!this.connectedUsers.has(user.id)) {
				this.connectedUsers.set(user.id, new Set());
			}
			this.connectedUsers.get(user.id).add(client.id);

			this.socketToUser.set(client.id, user.id);
		} catch {
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket): void {
		const userId = this.socketToUser.get(client.id);
		if (userId) {
			const userSockets = this.connectedUsers.get(userId);
			if (userSockets) {
				userSockets.delete(client.id);
				if (userSockets.size === 0) {
					this.connectedUsers.delete(userId);
				}
			}
			this.socketToUser.delete(client.id);
		}
	}

	sendNotification(userId: string, notification: NotificationsEntity): void {
		const userSockets = this.connectedUsers.get(userId);
		if (userSockets && userSockets.size > 0) {
			userSockets.forEach((socketId) => {
				this.server.to(socketId).emit('notification', notification);
			});
		}
	}

	public getUserIdBySocketId(socketId: string): string | undefined {
		return this.socketToUser.get(socketId);
	}

	public emitToUser({
		userId,
		event,
		data,
	}: {
		userId: string;
		event: string;
		data: unknown;
	}): void {
		const sockets = this.connectedUsers.get(userId);
		if (!sockets) return;
		sockets.forEach((id) => this.server.to(id).emit(event, data));
	}
}
