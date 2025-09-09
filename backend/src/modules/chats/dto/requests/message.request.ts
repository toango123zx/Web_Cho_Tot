import { TypeMessageEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class MessageRequestDto {
	@IsNotEmpty()
	@IsString()
	chatRoomId: string = '';

	@IsNotEmpty()
	@IsString()
	content: string = '';

	@IsNotEmpty()
	@IsString()
	@IsEnum(TypeMessageEnum)
	type: TypeMessageEnum;
}
