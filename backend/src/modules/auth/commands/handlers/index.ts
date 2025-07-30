import { ForgotPasswordHandler } from './forgotPassword.handler';
import { LoginHandler } from './login.handler';
import { LogoutHandler } from './logout.handler';
import { RefreshTokenHandler } from './refreshToken.handler';
import { RegisterHandler } from './register.handler';
import { SendOtpToEmailHandler } from './sendOtpToEmail.handler';

export const AuthCommandHandlers = [
	ForgotPasswordHandler,
	LoginHandler,
	LogoutHandler,
	RefreshTokenHandler,
	RegisterHandler,
	SendOtpToEmailHandler,
];
