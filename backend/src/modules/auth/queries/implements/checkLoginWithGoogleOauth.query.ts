import { IQuery } from '@nestjs/cqrs';

import { SocialAccountsEntity } from 'src/models';

export class CheckLoginWithGoogleOauthQuery implements IQuery {
	constructor(public readonly socialAccount: SocialAccountsEntity) {}
}
