import { LoginHandler } from './login.handler';
import { RefreshTokenHandler } from './refreshToken.handler';
import { RegisterHandler } from './register.handler';

export const AuthCommandHandlers = [LoginHandler, RegisterHandler, RefreshTokenHandler];
