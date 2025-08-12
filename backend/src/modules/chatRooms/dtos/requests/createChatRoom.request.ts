import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { AutoTrim } from 'src/common';

export class CreateChatRoomRequestDto {
	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	@AutoTrim()
	@IsUUID()
	userId: string;
}
