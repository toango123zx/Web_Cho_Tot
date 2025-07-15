import { GenderUserEnum, RoleUserEnum } from '@prisma/client';
import { AccountsEntity, UsersEntity } from 'src/models';

export class UserInformationDto {
	id: string;
	name: string;
	role: RoleUserEnum;
	email: string;
	address: string;
	phoneNumber: string;
	avatar: string;
	bio: string;
	gender: GenderUserEnum;
	dob: Date;
	nickName: string;
	balance: number;

	constructor(user: UsersEntity) {
		this.id = user.id;
		this.name = user.name;
		this.role = user.role;
		this.email = user.email;
		this.address = user.address;
		this.phoneNumber = user.phoneNumber;
		this.avatar = user.avatar;
		this.bio = user.bio;
		this.gender = user.gender;
		this.dob = user.dob;
		this.nickName = user.nickName;
		this.balance = user.balance;
	}

	static constructorFromAccount(account: AccountsEntity): UserInformationDto {
		const user: UsersEntity = {
			...account.user,
		};
		return new UserInformationDto(user);
	}

	getUserInformation(): UserInformationDto {
		return {
			id: this.id,
			name: this.name,
			role: this.role,
			email: this.email,
			address: this.address,
			phoneNumber: this.phoneNumber,
			avatar: this.avatar,
			bio: this.bio,
			gender: this.gender,
			dob: this.dob,
			nickName: this.nickName,
			balance: this.balance,
		} as UserInformationDto;
	}
}
