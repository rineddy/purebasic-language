import {
	DocumentFormattingParams,
	DocumentOnTypeFormattingParams,
	DocumentRangeFormattingParams,
	FormattingOptions,
	TextDocument,
	TextEdit,
} from 'vscode-languageserver';
import { ICustomRegexReplacer, pb } from './PureBasicAPI';

export class PureBasicFormatter {
	private readonly FORMATTING_RULES: ICustomRegexReplacer[] = [
		[/\s+/g, ' '],
		[/\s+(,)/g, '$1'],
		[/(,)(?=\S)/g, '$1 '],
		[/\s+(\.|\\)/g, '$1'],
		[/(\.|\\)\s+/g, '$1'],
		[/\s+(::)/g, '$1'],
		[/(::)\s+/g, '$1'],
		[/\s+([})\]])/g, '$1'],
		[/([{([])\s+/g, '$1'],
		[/([^\s><=])(?=<>|<=|>=|=>|>=|=|<|>)/g, '$1 '],
		[/(<>|<=|>=|=>|>=|=|<|>)(?=[^\s><=])/g, '$1 '],
		[/(\S)(?=\/|<<|>>|\+|\|)/g, '$1 '],
		[/(\/|<<|>>|\+|\|)(?=\S)/g, '$1 '],
		[/([^\s:])(?=:[^:])/g, '$1 '],
		[/([^:]:)(?=[^\s:])/g, '$1 '],
	];

	/**
	 * Format whole doc
	 */
	public async formatAll(params: DocumentFormattingParams): Promise<TextEdit[]> {
		const doc = await pb.documentation.find(params.textDocument.uri);
		return pb.formatter.formatLineByLine(doc, params.options, 0, doc.lineCount - 1);
	}
	/**
	 * Format doc when user is selecting text
	 */
	public async formatRange(params: DocumentRangeFormattingParams): Promise<TextEdit[]> {
		const doc = await pb.documentation.find(params.textDocument.uri);
		return pb.formatter.formatLineByLine(doc, params.options, params.range.start.line, params.range.end.line, params.range.end.character);
	}
	/**
	 * Format doc when user is typing
	 */
	public async formatOnType(params: DocumentOnTypeFormattingParams): Promise<TextEdit[]> {
		const doc = await pb.documentation.find(params.textDocument.uri);
		return pb.formatter.formatLineByLine(doc, params.options, params.position.line - 1, params.position.line, params.position.character);
	}
	/**
	 * Format doc line by line
	 * @param doc
	 * @param options format options to used
	 * @param startLine start line to format
	 * @param endLine end line to format
	 * @param endLineCharacter end line last character position ( or end of line position if 'undefined' )
	 * @returns array of text modifications
	 */
	private async formatLineByLine(doc: TextDocument, options: FormattingOptions, startLine: number, endLine: number, endLineCharacter?: number): Promise<TextEdit[]> {
		const textEdits: TextEdit[] = [];
		const indenting = await pb.indentation.create(doc, options);
		for (let line = startLine - 1; line >= 0; line--) {
			const { lineText } = pb.documentation.readLine(doc, line);
			const lineStruct = pb.text.deconstruct(lineText);
			if (pb.indentation.pick(lineStruct, indenting)) {
				break;
			}
		}
		for (let line = startLine; line <= endLine; line++) {
			const { lineRange, lineText, lineCutText, lineCutRange } = pb.documentation.readLine(doc, line, line === endLine ? endLineCharacter : undefined);
			const formattedText = pb.text.restructure(lineText, lineStruct => {
				pb.indentation.update(lineStruct, indenting);
				pb.text.beautify(lineStruct, pb.formatter.FORMATTING_RULES);
				if (lineCutRange && lineCutText) {
					if (lineStruct.isBlank && lineCutText.match(/^\s+/)) {
						textEdits.push(TextEdit.replace(lineCutRange, lineCutText.trimLeft()));
					}
				}
				else {
					lineStruct.endSpaces = '';
				}
			});
			if (formattedText !== lineText) {
				textEdits.push(TextEdit.replace(lineRange, formattedText));
			}
		}
		return Promise.resolve(textEdits);
	}
}