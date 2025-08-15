import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
	constructor(public readonly location?: string) {
		if (!location) {
			location = '';
		}
		super(
			{
				success: false,
				message: `Không tìm thấy ${location}`,
			},
			HttpStatus.NOT_FOUND,
		);
	}
}
