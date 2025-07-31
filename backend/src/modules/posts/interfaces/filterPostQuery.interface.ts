import { IPaginationQuery } from 'src/common';

export enum PostStatusEnum {
	PENDING = 'PENDING',
	PUBLISHED = 'PUBLISHED',
	EXPIRED = 'EXPIRED',
}

export interface IFilterPostQuery extends IPaginationQuery {
	status?: PostStatusEnum;
}
