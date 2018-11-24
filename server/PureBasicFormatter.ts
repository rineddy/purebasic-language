import {
	DocumentFormattingParams,
	DocumentOnTypeFormattingParams,
	DocumentRangeFormattingParams,
	FormattingOptions,
	Range,
	TextDocument,
	TextEdit,
} from 'vscode-languageserver';

import { pb } from './PureBasicAPI';

export class PureBasicFormatter {
	/**
	 * Format whole doc
	 */
	public async formatAll(params: DocumentFormattingParams): Promise<TextEdit[]> {
		const doc = await pb.documents.find(params.textDocument.uri);
		return pb.formatter.formatSelectedLines(doc, params.options, 0, doc.lineCount - 1, Number.MAX_SAFE_INTEGER);
	}
	/**
	 * Format doc when user is selecting text
	 */
	public async formatRange(params: DocumentRangeFormattingParams): Promise<TextEdit[]> {
		const doc = await pb.documents.find(params.textDocument.uri);
		return pb.formatter.formatSelectedLines(doc, params.options, params.range.start.line, params.range.end.line, params.range.end.character);
	}
	/**
	 * Format doc when user is typing
	 */
	public async formatOnType(params: DocumentOnTypeFormattingParams): Promise<TextEdit[]> {
		const doc = await pb.documents.find(params.textDocument.uri);
		return pb.formatter.formatSelectedLines(doc, params.options, params.position.line, params.position.line, params.position.character);
	}
	/**
	 * Apply formatting rules, line by line, on selected text
	 */
	private async formatSelectedLines(doc: TextDocument, options: FormattingOptions, startLine: number, endLine: number, endLineCharacter: number): Promise<TextEdit[]> {
		const textEdits: TextEdit[] = [];
		const indents = await pb.indentation.create(doc, options);
		for (let line = startLine - 1; line >= 0; line--) {
			const rg: Range = Range.create(line, 0, line, Number.MAX_SAFE_INTEGER);
			const lineText = doc.getText(rg);
			let lineStruct = pb.text.deconstruct(lineText);
			if (lineStruct.content || lineStruct.comment) {
				pb.indentation.update(indents, lineStruct);
				break;
			}
		}
		for (let line = startLine; line <= endLine; line++) {
			const rg: Range = Range.create(line, 0, line, line < endLine ? Number.MAX_SAFE_INTEGER : endLineCharacter);
			const lineText = doc.getText(rg);
			let lineStruct = pb.text.deconstruct(lineText);
			pb.indentation.update(indents, lineStruct);
			let { content } = lineStruct;
			content = content.replace(/\s+/g, ' ');
			content = content.replace(/\s+(,)/g, '$1');
			content = content.replace(/(,)(?=\S)/g, '$1 ');
			content = content.replace(/\s+(\.|\\)/g, '$1');
			content = content.replace(/(\.|\\)\s+/g, '$1');
			content = content.replace(/\s+(::)/g, '$1');
			content = content.replace(/(::)\s+/g, '$1');
			content = content.replace(/\s+([})\]])/g, '$1');
			content = content.replace(/([{([])\s+/g, '$1');
			content = content.replace(/([^\s><=])(?=<>|<=|>=|=>|>=|=|<|>)/g, '$1 ');
			content = content.replace(/(<>|<=|>=|=>|>=|=|<|>)(?=[^\s><=])/g, '$1 ');
			content = content.replace(/(\S)(?=\/|<<|>>|\+)/g, '$1 ');
			content = content.replace(/(\/|<<|>>|\+)(?=\S)/g, '$1 ');
			content = content.replace(/([^\s:])(?=:[^:])/g, '$1 ');
			content = content.replace(/([^:]:)(?=[^\s:])/g, '$1 ');
			lineStruct.content = content;
			let formattedText = pb.text.reconstruct(lineStruct);
			formattedText = formattedText.trimRight();
			if (formattedText !== lineText) {
				textEdits.push(TextEdit.replace(rg, formattedText));
			}
		}
		return Promise.resolve(textEdits);
	}
}