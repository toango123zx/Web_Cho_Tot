import { Injectable } from '@nestjs/common';

import { CreateOtpsDto, OtpsEntity, UpdateOtpsDto } from 'src/models';
import { PrismaService } from 'src/modules/database/services';

@Injectable()
export class OtpsRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findOtp({
		userId,
		otp,
	}: {
		userId: string;
		otp?: string;
	}): Promise<OtpsEntity | null> {
		return this.prismaService.otps.findFirst({
			where: {
				userId: userId,
				otp: otp,
			},
		});
	}

	async createOtp(otps: CreateOtpsDto): Promise<OtpsEntity> {
		return this.prismaService.otps.create({
			data: {
				...otps,
				user: {
					connect: { id: otps.user.connect.id },
				},
			},
		});
	}

	async updateOtp({
		otpId,
		userId,
		otps,
	}: {
		otpId: string;
		userId?: string;
		otps: UpdateOtpsDto;
	}): Promise<OtpsEntity> {
		return this.prismaService.otps.update({
			where: { id: otpId, userId: userId },
			data: otps,
		});
	}

	async deleteOtp({ otpId }: { otpId: string }): Promise<OtpsEntity> {
		return this.prismaService.otps.delete({
			where: { id: otpId },
		});
	}
}
