import { pb } from './PureBasicAPI';

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
	 * @example thisText.replace(pb.text.ENDS_WITH_LINEBREAKS, '')
	 * @example if (thisText.match(pb.text.ENDS_WITH_LINEBREAKS)) { continue; }
	 */
	public readonly ENDS_WITH_LINEBREAKS = /[\r\n]+$/;
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
	 * Extracts indentation and content without line break characters from line text
	 * @example let [match, indentation, content] = thisText.match(pb.text.EXTRACTS_INDENTATION_CONTENT)
	 */
	public readonly EXTRACTS_INDENTATION_CONTENT = /^([\t ]*)(.*?)[\r\n]*$/;
	/**
	 * Finds string or comment in line text
	 */
	public readonly FINDS_STRING_OR_COMMENT = /(".+?"|'.+?'|["';].*)/g;


	/**
	 * Split `text` into parts
	 * @param {string} text original text to parse
	 * @returns {ISplittedText} splitted text info
	 */
	public splitParts(text: string): ISplittedText {
		let [, indentation, content] = text.match(pb.text.EXTRACTS_INDENTATION_CONTENT) || [undefined, '', ''];
		return <ISplittedText>{
			indentation: indentation,
			parts: content.split(pb.text.FINDS_STRING_OR_COMMENT).filter(part => part !== ''),
		};
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

