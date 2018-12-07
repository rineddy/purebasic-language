import { ICustomLineStruct, ICustomRegexReplacer, pb } from './PureBasicAPI';

export class PureBasicText {
	/**
	 *
	 * Extracts indents and full content without line break characters from line text
	 * @example let [match, indents, fullContent] = thisLineText.match(pb.text.EXTRACTS_INDENTS_FULLCONTENT)
	 */
	private readonly EXTRACTS_INDENTS_FULLCONTENT = /^([\t ]*)(.*?)[\r\n]*$/;
	/**
	 * Extracts words from text (ex: _Word123,$myWord,OtherW0rd$)
	 * @example let words = thisText.match(pb.text.EXTRACTS_WORDS)
	 */
	private readonly EXTRACTS_WORDS = /[$]?\b[_a-z]\w*\b[$]?/gi;
	/**
	 * Finds strings, comment and end spaces in text
	 */
	private readonly FINDS_STRINGS_COMMENT_ENDSPACES = /(")(?:[^"\\]|\\.)*"?|(')[^']*'?|(;).*?(?=\s*$)|(\s)\s*$/g;


	/**
	 * Retrieves line text after modifying its structure data
	 * @param lineText original text to parse
	 * @param modifyStruct function to modify line structure data
	 * @returns output text
	 */
	public restructure(lineText: string, modifyStruct: (lineStruct: ICustomLineStruct) => void): string {
		let lineStruct = this.deconstruct(lineText);
		if (modifyStruct) {
			modifyStruct(lineStruct);
		}
		return this.reconstruct(lineStruct);
	}
	/**
	 * Retrieves line structure data from `linetext` by extracting indents, content, strings, words and comment
	 * @param lineText original text to parse
	 * @returns output structure data
	 */
	public deconstruct(lineText: string): ICustomLineStruct {
		let [, indents, fullContent] = lineText.match(pb.text.EXTRACTS_INDENTS_FULLCONTENT) || [, '', ''];
		let strings: string[] = [];
		let comment = '';
		let endSpaces = '';
		let content = fullContent.replace(pb.text.FINDS_STRINGS_COMMENT_ENDSPACES, (match: string, s1: string, s2: string, s3: string, s4: string) => {
			if (s3) {
				comment = match;
			}
			else if (s4) {
				endSpaces = match;
			}
			else {
				strings.push(match);
			}
			return (s1 + s1) || (s2 + s2) || s3 || ''; // empty string or empty comment result
		});
		return <ICustomLineStruct>{
			indents: indents,
			content: content,
			words: content.match(pb.text.EXTRACTS_WORDS) || [],
			strings: strings,
			comment: comment,
			endSpaces: endSpaces,
			isBlank: content === '' && comment === ''
		};
	}
	/**
	 * Retrieves line text from `lineStruct` by combining indents, content, strings and comment
	 * @param lineStruct
	 * @returns output text
	 */
	public reconstruct(lineStruct: ICustomLineStruct): string {
		const { indents, content, strings, comment, endSpaces } = lineStruct;
		const lineText = indents + content.replace(pb.text.FINDS_STRINGS_COMMENT_ENDSPACES, (match: string) => {
			return match[0] === ';' ? comment : strings.shift() || '';
		}) + endSpaces;
		return lineText;
	}
	/**
	 * Beautify line content by replacing substrings
	 * @param lineStruct
	 * @param replacers array of replacement rules
	 */
	public beautify(lineStruct: ICustomLineStruct, replacers: ICustomRegexReplacer[]) {
		for (const replacer of replacers) {
			lineStruct.content = lineStruct.content.replace(replacer[0], replacer[1]);
		}
	}
}