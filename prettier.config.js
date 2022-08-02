module.exports = {
	printWidth: 120,
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: false,
	quoteProps: "as-needed",
	jsxSingleQuote: false,
	trailingComma: "es5",
	bracketSpacing: true,
	jsxBracketSameLine: false,
	arrowParens: "always",
	rangeStart: 0,
	rangeEnd: Infinity,
	requirePragma: false,
	insertPragma: false,
	proseWrap: "preserve",
	htmlWhitespaceSensitivity: "css",
	endOfLine: "lf",
	embeddedLanguageFormatting: "auto",
	overrides: [
		{
			files: "*.html",
			options: {
				parser: "html",
			},
		},
	],
};
