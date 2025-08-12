export type ValidationRule<V> = {
	fieldName?: string;
	pattern?: RegExp;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	customValidate?: (values: V) => boolean;
	errorMessage: string;
};

export type ValidationSchema<T> = {
	[field in keyof T]: ValidationRule<T>;
};

export type FormValues = {
	[field: string]: string;
};

export const regex: Record<string, RegExp> = {
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // email username at least 5 letters,
	password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, // includes at least one uppercase letter, one lowercase letter, one number, and one special character, password length at least 8 letter
};

export const validate = <T>(
	formValues: FormValues,
	validationSchema: ValidationSchema<T>,
) => {
	const errors: Record<string, string> = {};

	Object.keys(validationSchema).forEach((field) => {
		const rules = validationSchema[field as keyof T];
		const value = formValues[field];

		if (rules.required && !value.trim()) {
			errors[field] = rules.errorMessage || `${rules.fieldName || field} is required.`;
			return;
		}

		// Check pattern
		if (rules.pattern && !rules.pattern.test(value)) {
			errors[field] = rules.errorMessage;
			return;
		}

		// Check min length
		if (rules.minLength && value.length < rules.minLength) {
			errors[field] =
				rules.errorMessage ||
				`${rules.fieldName || field} must be at least ${rules.minLength} characters long.`;
			return;
		}

		// Check max length
		if (rules.maxLength && value.length > rules.maxLength) {
			errors[field] =
				rules.errorMessage ||
				`${rules.fieldName || field} must be less than ${rules.maxLength} characters long.`;
			return;
		}

		// Check custom typeValidationSchema
		if (rules.customValidate && !rules.customValidate(formValues as T)) {
			errors[field] = rules.errorMessage;
		}
	});

	return {
		isValid: Object.keys(errors).length === 0,
		errors: errors as Record<keyof T, string>,
	};
};
