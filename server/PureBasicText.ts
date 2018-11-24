import { ICustomLineStruct } from './PureBasicData';
import { pb } from './PureBasicAPI';

export class PureBasicText {
	/**
	 *
	 * Extracts indents and full content without line break characters from line text
	 * @example let [match, indents, fullContent] = thisLineText.match(pb.text.EXTRACTS_INDENTS_FULLCONTENT)
	 */
	public readonly EXTRACTS_INDENTS_FULLCONTENT = /^([\t ]*)(.*?)[\r\n]*$/;
	/**
	 * Extracts words from text (ex: _Word123,$myWord,OtherW0rd$)
	 * @example let words = thisText.match(pb.text.EXTRACTS_WORDS)
	 */
	public readonly EXTRACTS_WORDS = /[$]?\b[_a-z]\w*\b[$]?/gi;
	/**
	 * Finds strings, cut strings and comment in text
	 */
	public readonly FINDS_STRINGS_CUTSTRINGS_AND_COMMENT = /(")(?:[^"\\]|\\.)*"|(')[^']*'|(["';]).*/g;


	/**
	 * Retrieves line structure data from `linetext` by extracting indents, content, strings, words and comment
	 * @param {string} lineText original text to parse
	 * @returns {ICustomLineStruct} output structure data
	 */
	public deconstruct(lineText: string): ICustomLineStruct {
		let [, indents, fullContent] = lineText.match(pb.text.EXTRACTS_INDENTS_FULLCONTENT) || [undefined, '', ''];
		let strings: string[] = [];
		let comment: string = '';
		let content = fullContent.replace(pb.text.FINDS_STRINGS_CUTSTRINGS_AND_COMMENT, (match: string, s1: string, s2: string, s3: string) => {
			if (match[0] === ';') {
				comment = match;
			} else {
				strings.push(match);
			}
			return (s1 + s1) || (s2 + s2) || s3 || ''; // empty string or empty comment result
		});
		return <ICustomLineStruct>{
			indents: indents,
			content: content,
			words: content.match(pb.text.EXTRACTS_WORDS) || [],
			strings: strings,
			comment: comment
		};
	}
	/**
	 * Retrieves line text from `lineStruct` by combining indents, content, strings and comment
	 * @param {ICustomLineStruct} lineStruct
	 * @returns {string} output text
	 */
	public reconstruct(lineStruct: ICustomLineStruct): string {
		const { indents, content, strings, comment } = lineStruct;
		const lineText = indents + content.replace(pb.text.FINDS_STRINGS_CUTSTRINGS_AND_COMMENT, (match: string) => {
			return match[0] === ';' ? comment : strings.shift() || '';
		});
		return lineText;
	}
}