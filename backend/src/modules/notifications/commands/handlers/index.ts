import { CreateNotificationHandler } from './create-notification.handler';
import { ReadNotificationHandler } from './readNotification.handler';

export const NotificationCommandHandlers = [
	CreateNotificationHandler,
	ReadNotificationHandler,
];
