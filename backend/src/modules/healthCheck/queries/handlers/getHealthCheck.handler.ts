import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { HealthCheckRepository } from '../../healthCheck.repository';
import { GetHealthCheckQuery } from '../implements';

@QueryHandler(GetHealthCheckQuery)
export class GetHealthCheckHandler implements IQueryHandler<GetHealthCheckQuery> {
	constructor(private readonly healthCheckRepository: HealthCheckRepository) {}
	async execute(): Promise<string> {
		const connectDatabase = await this.healthCheckRepository.getConnection();
		if (!connectDatabase) {
			throw Error('Database connection failed!');
		}
		return 'Okey';
	}
}
