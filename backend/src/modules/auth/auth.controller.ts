import { Body, Controller, HttpException, Post, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponseBodyDto, SetCookieInterceptor } from 'src/common';

import { LoginCommand, RegisterCommand } from './commands/implements';
import {
	LoginRequestDto,
	LoginResponseDto,
	RegisterRequestDto,
	RegisterResponseDto,
} from './dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post('login')
	@UseInterceptors(SetCookieInterceptor)
	async loginUser(
		@Body() loginDto: LoginRequestDto,
	): Promise<HttpResponseBodyDto<LoginResponseDto | HttpException>> {
		return this.commandBus.execute(new LoginCommand(loginDto));
	}

	@Post('register')
	async registerUser(
		@Body() registerDto: RegisterRequestDto,
	): Promise<HttpResponseBodyDto<RegisterResponseDto | HttpException>> {
		return this.commandBus.execute(new RegisterCommand(registerDto));
	}
}
