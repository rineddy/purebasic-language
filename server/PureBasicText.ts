import { IDeconstructedText } from './PureBasicData';
import { pb } from './PureBasicAPI';

export class PureBasicText {
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
	 * Finds strings and comment in text
	 */
	public readonly FINDS_STRINGS_AND_COMMENT = /(")(?:[^"\\]|\\.)*"|(')[^']*'|(["';]).*/g;


	/**
	 * Deconstruct `text` to retrieve spaces, content, strings, words and comment
	 * @param {string} text original text to parse
	 * @returns {IDeconstructedText} deconstructed text info
	 */
	public deconstruct(text: string): IDeconstructedText {
		let [, spaces, content] = text.match(pb.text.EXTRACTS_SPACES_CONTENT) || [undefined, '', ''];
		let strings: string[] = [];
		let comment: string = '';
		content = content.replace(pb.text.FINDS_STRINGS_AND_COMMENT, (match: string, s1: string, s2: string, s3: string) => {
			if (s3) {
				comment = match;
			} else {
				strings.push(match);
			}
			return (s1 + s1) || (s2 + s2) || s3 || ''; // empty string or empty comment result
		});
		return <IDeconstructedText>{
			indents: spaces,
			content: content,
			words: content.match(pb.text.EXTRACTS_WORDS) || [],
			strings: strings,
			comment: comment
		};
	}
	/**
	 * Recontruct `deconstructed` text to retrieve indented line text with comment
	 * @param {IDeconstructedText} deconstructed
	 * @returns {string} contructed text
	 */
	public reconstruct(deconstructed: IDeconstructedText): string {
		const { indents, content, strings, comment } = deconstructed;
		const text = indents + content.replace(pb.text.FINDS_STRINGS_AND_COMMENT, (match: string) => {
			return match[0] === ';' ? comment : strings.shift() || '';
		});
		return text;
	}
}