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
	readonly options: FormattingOptions;
	readonly indentRules: ICustomIndentRule[];
}
/**
 * Represents line text structure (indentation spaces, text content, words, strings, comment)
 */
export interface ICustomLineStruct {
	indents: string;
	content: string;
	words: string[];
	strings: string[];
	comment: string;
}