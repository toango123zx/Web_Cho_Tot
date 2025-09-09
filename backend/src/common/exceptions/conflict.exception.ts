import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
	constructor(public readonly location?: string) {
		super(
			{
				success: false,
				message: `Đã tồn tại ${location}`,
			},
			HttpStatus.CONFLICT,
		);
	}
}
