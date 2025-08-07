import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { OptionalException } from 'src/common';
import { OtpsConfig } from 'src/configs';
import { OtpsEntity } from 'src/models';

import { OtpsRepository } from '../otps.repository';

@Injectable()
export class OtpsService {
	constructor(private readonly otpsRepository: OtpsRepository) {}

	async generateOtp({ userId }: { userId: string }): Promise<OtpsEntity> {
		const otpExists = await this.otpsRepository.findOtp({ userId });
		if (otpExists && otpExists.expiresAt > new Date()) {
			throw new OptionalException(
				HttpStatus.CONFLICT,
				`OTP sẽ được cấp lại sau ${Math.ceil((otpExists.expiresAt.getTime() - new Date().getTime()) / 1000)} giây`,
			);
		}

		const otp = Math.floor(100000 + Math.random() * 999999).toString();
		const otpExpiresAt = new Date(Date.now() + OtpsConfig.otpExpiresIn * 60 * 1000);

		if (otpExists) {
			const otpData = await this.otpsRepository.updateOtp({
				otpId: otpExists.id,
				otps: {
					otp,
					expiresAt: otpExpiresAt,
				},
			});
			return otpData;
		}

		const otpData = await this.otpsRepository.createOtp({
			otp: otp,
			expiresAt: otpExpiresAt,
			user: {
				connect: { id: userId },
			},
		});
		return otpData;
	}

	async verifyOtp({
		otp,
		userId,
	}: {
		otp: string;
		userId: string;
	}): Promise<boolean | HttpException> {
		const otpRecord = await this.otpsRepository.findOtp({
			userId: userId,
			otp: otp,
		});
		if (!otpRecord) {
			throw new OptionalException(HttpStatus.UNAUTHORIZED, 'OTP không đúng');
		}

		if (otpRecord.expiresAt < new Date()) {
			await this.otpsRepository.deleteOtp({ otpId: otpRecord.id });
			throw new OptionalException(HttpStatus.UNAUTHORIZED, 'OTP đã hết hạn');
		}

		if (otpRecord.otp !== otp) {
			throw new OptionalException(HttpStatus.UNAUTHORIZED, 'OTP không đúng');
		}

		await this.otpsRepository.deleteOtp({ otpId: otpRecord.id });

		return true;
	}
}
