import { CheckLoginWithGoogleOauthHandler } from './checkLoginWithGoogleOauth.handler';
import { LoginWithGoogleOauthHandler } from './loginWithGoogleOauth.handler';

export const AuthQueryHandlers = [
	LoginWithGoogleOauthHandler,
	CheckLoginWithGoogleOauthHandler,
];
