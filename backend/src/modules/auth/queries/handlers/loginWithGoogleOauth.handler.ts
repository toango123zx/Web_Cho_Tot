import { HttpException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HttpResponseBodySuccessDto } from 'src/common';

import { LoginWithGoogleOauthQuery } from '../implements';

@QueryHandler(LoginWithGoogleOauthQuery)
export class LoginWithGoogleOauthHandler
	implements IQueryHandler<LoginWithGoogleOauthQuery>
{
	constructor() {}

	async execute(): Promise<HttpResponseBodySuccessDto<string> | HttpException> {
		return {
			success: true,
			data: 'Login with Google OAuth successful',
		};
	}
}
