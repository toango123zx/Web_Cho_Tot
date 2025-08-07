import { applyDecorators, UseGuards } from '@nestjs/common';

import { OptionalAuthGuard } from '../guards/optional-auth.guard';

export const OptionalAuth = (): MethodDecorator & ClassDecorator & PropertyDecorator =>
	applyDecorators(UseGuards(OptionalAuthGuard));
