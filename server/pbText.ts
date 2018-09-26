export namespace pbText {
	export interface ITextParts {
		indentation: string;
		parts: string[];
	}
	/**
	 * remove line break characters from `text`
	 * @param text
	 */
	export function removeLineBreak(text: string): string {
		return text.replace(/[\r\n]+/, '');
	}
	/**
	 * split `text` into parts
	 */
	export function splitParts(text: string): ITextParts {
		let matches = text.match(/^([\t ]*)(.*?)[\r\n]*$/);
		return matches ? <ITextParts>{
			indentation: matches[1],
			parts: matches[2].split(/(".+?"|'.+?'|["';].*)/g).filter(part => part !== ''),
		} : <ITextParts>{};
	}
	/**
	 * Determines if any text ends with line breaks
	 */
	export const LINE_BREAKS = /[\r\n]+$/;
	/**
	 * Determines if any text starts with a comment character
	 */
	export const STARTS_WITH_COMMENT = /^;/;
	/**
	 * Determines if any text starts with a spacing character
	 */
	export const STARTS_WITH_SPACING = /^\s/;
	/**
	 * Determines if any text starts with a string/comment character
	 */
	export const STARTS_WITH_STRING_OR_COMMENT = /^["';]/;
	/**
	 * Retrieves `text` with appended `suffix` and/or prepended `prefix`
	 * @param text
	 * @param prefix
	 * @param suffix
	 */
	export function addExtensions(text: string, prefix: string, suffix: string) {
		return (!prefix && !suffix) ? text : prefix + text + suffix;
	}
	/**
	 * Retrieves `text` without
	 * @param text
	 * @param prefix
	 * @param suffix
	 */
	export function removeExtensions(text: string, prefix: string, suffix: string) {
		return (!prefix && !suffix) ? text : text.substr(prefix.length, text.length - suffix.length - prefix.length);
	}
}

