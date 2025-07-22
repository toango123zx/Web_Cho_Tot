import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
	globalIgnores(['dist']),
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: tseslint.parser, // ✅ Thêm dòng này
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: globals.browser,
		},
		plugins: {
			'react-hooks': reactHooks,
		},
		rules: {
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
		},
	},
	{
		files: ['**/*.{ts,tsx}'],
		extends: [reactRefresh.configs.vite],
	},
]);
