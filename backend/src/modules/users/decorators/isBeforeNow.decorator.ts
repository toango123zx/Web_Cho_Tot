import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';

export function IsBeforeNow(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string): void {
		registerDecorator({
			name: 'isBeforeNow',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: string | number | Date | undefined) {
					if (!value) return false;

					const inputDate = new Date(value);
					const now = new Date();

					return inputDate.getTime() < now.getTime();
				},
				defaultMessage(args: ValidationArguments) {
					return `${args.property} must be a date before the current time`;
				},
			},
		});
	};
}
