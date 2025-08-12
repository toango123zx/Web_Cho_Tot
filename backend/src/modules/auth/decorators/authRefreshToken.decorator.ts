import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthRefreshTokenGuard } from '../guards';

export const AuthRefreshToken = (): MethodDecorator &
	ClassDecorator &
	PropertyDecorator =>
	applyDecorators(UseGuards(AuthRefreshTokenGuard), ApiBearerAuth());
