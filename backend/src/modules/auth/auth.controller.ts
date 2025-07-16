import {
	Body,
	Controller,
	HttpException,
	Post,
	Put,
	UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponseBodyDto, SetCookieInterceptor } from 'src/common';
import { MyInformation } from 'src/modules/users/decorators';
import { UserInformationDto } from 'src/modules/users/dtos';

import {
	LoginCommand,
	RefreshTokenCommand,
	RegisterCommand,
} from './commands/implements';
import { AuthRefreshToken, RefreshToken } from './decorators';
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

	@Put('refresh-token')
	@AuthRefreshToken()
	@UseInterceptors(SetCookieInterceptor)
	async refreshToken(
		@MyInformation() myInformation: UserInformationDto,
		@RefreshToken() token: string,
	): Promise<HttpResponseBodyDto<LoginResponseDto | HttpException>> {
		return this.commandBus.execute(new RefreshTokenCommand(myInformation, token));
	}
}
