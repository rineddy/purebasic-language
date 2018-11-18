import { FormattingOptions } from 'vscode-languageserver';

/**
 * Represents Purebasic indentation rules
 */
export interface ICustomIndentRule {
	match: string;
	before: number;
	after: number;
}
/**
 * Represents Purebasic settings customized by user
 */
export interface ICustomSettings {
	diagnostics: {
		maxNumberOfProblems: number;
	};
	indentation: {
		rules: ICustomIndentRule[];
	};
}
/**
 * Represents custom line indentation
 */
export interface ICustomIndentation {
	current: string;
	next: string;
	options: FormattingOptions;
	indentRules: ICustomIndentRule[];
}
/**
 * Represents parsed text (indentation spaces, words, sub-parts)
 */
export interface IParsedText {
	spaces: string;
	words: string[];
	parts: string[];
}