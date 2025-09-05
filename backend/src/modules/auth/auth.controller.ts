import {
	Body,
	Controller,
	Get,
	HttpException,
	Post,
	Put,
	Req,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponseBodyDto, SetCookieInterceptor } from 'src/common';
import { SocialAccountsEntity } from 'src/models';
import { MyInformation } from 'src/modules/users/decorators';
import { UserInformationDto } from 'src/modules/users/dtos';

import {
	ForgotPasswordCommand,
	LoginCommand,
	RefreshTokenCommand,
	RegisterCommand,
	SendOtpToEmailCommand,
} from './commands/implements';
import { AuthRefreshToken, RefreshToken } from './decorators';
import {
	ForgotPasswordRequestDto,
	ForgotPasswordResponseDto,
	LoginRequestDto,
	LoginResponseDto,
	RegisterRequestDto,
	RegisterResponseDto,
	SendOtpRequestDto,
} from './dtos';
import { GoogleOAuthGuard } from './guards';
import {
	CheckLoginWithGoogleOauthQuery,
	LoginWithGoogleOauthQuery,
} from './queries/implements';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

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

	@Get('google/login')
	@UseGuards(GoogleOAuthGuard)
	async googleLogin(): Promise<HttpResponseBodyDto<string>> {
		return this.queryBus.execute(new LoginWithGoogleOauthQuery());
	}

	@Get('google/check-login')
	@UseGuards(GoogleOAuthGuard)
	async checkGoogleLogin(
		@Req() { user }: { user: SocialAccountsEntity },
	): Promise<HttpResponseBodyDto<LoginResponseDto | HttpException>> {
		return this.queryBus.execute(new CheckLoginWithGoogleOauthQuery(user));
	}

	@Post('send-otp')
	async sendOtp(
		@Body() sendOtp: SendOtpRequestDto,
	): Promise<HttpResponseBodyDto<string | HttpException>> {
		return this.commandBus.execute(new SendOtpToEmailCommand(sendOtp.email));
	}

	@Post('forgot-password')
	async forgotPassword(
		@Body() forgotPassword: ForgotPasswordRequestDto,
	): Promise<HttpResponseBodyDto<ForgotPasswordResponseDto | HttpException>> {
		return this.commandBus.execute(new ForgotPasswordCommand(forgotPassword));
	}
}
