import { PostStatusEnum } from '@prisma/client';
import { IPaginationQuery } from 'src/common';

export interface IFilterPostQuery extends IPaginationQuery {
	status?: PostStatusEnum;
}
