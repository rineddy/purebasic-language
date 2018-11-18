import { IParsedText } from './PureBasicData';
import { pb } from './PureBasicAPI';

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
	 * @example if (thisText.match(pb.text.STARTS_WITH_SPACE)) { continue; }
	 */
	public readonly STARTS_WITH_SPACE = /^\s/;
	/**
	 * Determines if any text starts with a string/comment character
	 * @example if (thisText.match(pb.text.STARTS_WITH_STRING_OR_COMMENT)) { continue; }
	 */
	public readonly STARTS_WITH_STRING_OR_COMMENT = /^["';]/;
	/**
	 *
	 * Extracts spaces and content without line break characters from line text
	 * @example let [match, spaces, content] = thisLineText.match(pb.text.EXTRACTS_SPACES_CONTENT)
	 */
	public readonly EXTRACTS_SPACES_CONTENT = /^([\t ]*)(.*?)[\r\n]*$/;
	/**
	 * Extracts words from text (ex: _Word123,$myWord,OtherW0rd$)
	 * @example let words = thisText.match(pb.text.EXTRACTS_WORDS)
	 */
	public readonly EXTRACTS_WORDS = /[$]?\b[_a-z]\w*\b[$]?/gi;
	/**
	 * Finds string or comment in line text
	 */
	public readonly FINDS_STRING_OR_COMMENT = /(".+?"|'.+?'|["';].*)/g;


	/**
	 * Parse `text` to retrieve spaces, words and splitted parts
	 * @param {string} text original text to parse
	 * @returns {IParsedText} parsed text info
	 */
	public parse(text: string): IParsedText {
		const [, spaces, content] = text.match(pb.text.EXTRACTS_SPACES_CONTENT) || [undefined, '', ''];
		return <IParsedText>{
			spaces: spaces,
			parts: content.split(pb.text.FINDS_STRING_OR_COMMENT).filter(part => part !== ''),
			words: content.replace(pb.text.FINDS_STRING_OR_COMMENT, '').match(pb.text.EXTRACTS_WORDS) || []
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

