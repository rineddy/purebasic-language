/**
 * Represents splitted text (indent, sub-parts)
 */
interface ISplittedText {
	indentation: string;
	parts: string[];
}

export class PureBasicText {
	/**
	 * Determines if any text ends with line breaks
	 * @example thisText.replace(pb.text.LINE_BREAKS, '')
	 * @example if (thisText.match(pb.text.LINE_BREAKS)) { continue; }
	 */
	public readonly LINE_BREAKS = /[\r\n]+$/;
	/**
	 * Determines if any text starts with a comment character
	 * @example if (thisText.match(pb.text.STARTS_WITH_COMMENT)) { continue; }
	 */
	public readonly STARTS_WITH_COMMENT = /^;/;
	/**
	 * Determines if any text starts with a spacing character
	 * @example if (thisText.match(pb.text.STARTS_WITH_SPACING)) { continue; }
	 */
	public readonly STARTS_WITH_SPACING = /^\s/;
	/**
	 * Determines if any text starts with a string/comment character
	 * @example if (thisText.match(pb.text.STARTS_WITH_STRING_OR_COMMENT)) { continue; }
	 */
	public readonly STARTS_WITH_STRING_OR_COMMENT = /^["';]/;

	/**
	 * Split `text` into parts
	 * @param {string} text original text to parse
	 * @returns {ISplittedText} splitted text info
	 */
	public splitParts(text: string): ISplittedText {
		let matches = text.match(/^([\t ]*)(.*?)[\r\n]*$/);
		return matches ? <ISplittedText>{
			indentation: matches[1],
			parts: matches[2].split(/(".+?"|'.+?'|["';].*)/g).filter(part => part !== ''),
		} : <ISplittedText>{};
	}
	/**
	 * Retrieves `text` with appended `suffix` and/or prepended `prefix`
	 * @param text
	 * @param prefix
	 * @param suffix
	 */
	public addExtensions(text: string, prefix: string, suffix: string) {
		return (!prefix && !suffix) ? text : prefix + text + suffix;
	}
	/**
	 * Retrieves `text` without
	 * @param text
	 * @param prefix
	 * @param suffix
	 */
	public removeExtensions(text: string, prefix: string, suffix: string) {
		return (!prefix && !suffix) ? text : text.substr(prefix.length, text.length - suffix.length - prefix.length);
	}
}

