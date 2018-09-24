export namespace pbText {
	export interface TextParts {
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
	export function splitParts(text: string): TextParts {
		let matches = text.match(/^([\t ]*)(.*?)[\r\n]*$/);
		return matches ? <TextParts>{
			indentation: matches[1],
			parts: matches[2].split(/(".+?"|'.+?'|["';].*)/g).filter(part => part !== ''),
		} : <TextParts>{};
	}
	/**
	 * Determines if `text` starts with a spacing character
	 * @param text
	 */
	export function startsWithSpacing(text: string): boolean {
		return text.match(/^\s/) !== null;
	}
	/**
	 * Determines if `text` starts with a string/comment character
	 * @param text
	 */
	export function startsWithStringOrComment(text: string): boolean {
		return text.match(/^["';]/) !== null;
	}
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

