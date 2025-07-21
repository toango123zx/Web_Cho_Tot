import { ApiProperty } from '@nestjs/swagger';

class PaginationDto {
	@ApiProperty({
		required: true,
		type: Number,
	})
	totalItems: number;
	@ApiProperty({
		required: true,
		type: Number,
	})
	itemsPerPage: number;
	@ApiProperty({
		required: true,
		type: Number,
	})
	currentPage: number;
	@ApiProperty({
		required: true,
		type: Number,
	})
	totalPages: number;
}

export class HttpResponseBodyDto<T> {
	@ApiProperty({
		required: true,
		type: Boolean,
	})
	success: boolean;
	@ApiProperty({
		required: false,
		type: Object,
	})
	data?: T;
	@ApiProperty({
		required: false,
		type: String,
	})
	message?: string;
	@ApiProperty({
		required: false,
		type: String,
	})
	error?: string;
	@ApiProperty({
		required: false,
		type: Object,
	})
	pagination?: PaginationDto;
	@ApiProperty({
		required: false,
		type: Object,
		additionalProperties: {
			oneOf: [
				{ type: 'string' },
				{ type: 'number' },
				{ type: 'boolean' },
				{ type: 'object' },
			],
		},
	})
	cookie?: Record<string, string | number | boolean | object>;
}
