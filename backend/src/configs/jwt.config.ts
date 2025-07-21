export const jwtConfig = {
	expiresInAccessKey:
		process.env.EXPIRES_IN_ACCESS_KEY ||
		((): string => {
			if (process.env.NODE_ENV === 'production') {
				throw new Error('EXPIRES_IN_ACCESS_KEY must be set in production');
			}
			return 'dev-secret';
		})(),
	secretAccessKey:
		process.env.JWT_SECRET_ACCESS_KEY ||
		((): string => {
			if (process.env.NODE_ENV === 'production') {
				throw new Error('JWT_SECRET_ACCESS_KEY must be set in production');
			}
			return 'dev-secret';
		})(),
	expiresInRefreshKey:
		process.env.EXPIRES_IN_REFRESH_KEY ||
		((): string => {
			if (process.env.NODE_ENV === 'production') {
				throw new Error('EXPIRES_IN_REFRESH_KEY must be set in production');
			}
			return 'dev-secret';
		})(),
	secretRefreshKey:
		process.env.JWT_SECRET_REFRESH_KEY ||
		((): string => {
			if (process.env.NODE_ENV === 'production') {
				throw new Error('JWT_SECRET_REFRESH_KEY must be set in production');
			}
			return 'dev-secret';
		})(),
};
