import { LoginHandler } from './login.handler';
import { RefreshTokenHandler } from './refreshToken.handler';
import { RegisterHandler } from './register.handler';
import { SendOtpToEmailHandler } from './sendOtpToEmail.handler';

export const AuthCommandHandlers = [
	LoginHandler,
	RefreshTokenHandler,
	RegisterHandler,
	SendOtpToEmailHandler,
];
