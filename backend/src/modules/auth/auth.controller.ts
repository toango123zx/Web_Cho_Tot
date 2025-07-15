import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponseBodyDto } from 'src/common';

import { RegisterCommand } from './commands/implements';
import { RegisterRequestDto, RegisterResponseDto } from './dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post('register')
	async registerUser(
		@Body() registerDto: RegisterRequestDto,
	): Promise<HttpResponseBodyDto<RegisterResponseDto | HttpException>> {
		return this.commandBus.execute(new RegisterCommand(registerDto));
	}
}
