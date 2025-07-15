import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { RoleUserEnum } from '@prisma/client';
import { ROLE_KEY } from 'src/common';

import { AuthGuard } from '../guards';

export const AuthRole = (
	roles: RoleUserEnum,
): MethodDecorator & ClassDecorator & PropertyDecorator =>
	applyDecorators(SetMetadata(ROLE_KEY, roles), UseGuards(AuthGuard), ApiBearerAuth());
