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
		const indentation = await pb.indentator.create(doc, options);
		for (let line = startLine - 1; line >= 0; line--) {
			let rg: Range = Range.create(line, 0, line, Number.MAX_SAFE_INTEGER);
			let text = doc.getText(rg);
			let { spaces, words, parts } = pb.text.parse(text);
			if (parts.length > 0) {
				pb.indentator.update(indentation, words, spaces);
				break;
			}
		}
		for (let line = startLine; line <= endLine; line++) {
			let rg: Range = Range.create(line, 0, line, line < endLine ? Number.MAX_SAFE_INTEGER : endLineCharacter);
			let text = doc.getText(rg);
			let { spaces, words, parts } = pb.text.parse(text);
			pb.indentator.update(indentation, words, spaces);
			parts.forEach((part, index, parts) => {
				if (!part.match(pb.text.STARTS_WITH_STRING_OR_COMMENT)) {
					let charBeforePart = (index > 0) ? parts[index - 1].substr(-1) : '';
					let charAfterPart = (index < parts.length - 1) ? parts[index + 1].substr(0, 1) : '';
					part = pb.text.addExtensions(part, charBeforePart, charAfterPart);
					part = part.replace(/\s+/g, ' ');
					part = part.replace(/\s+(,)/g, '$1');
					part = part.replace(/(,)(?=\S)/g, '$1 ');
					part = part.replace(/\s+(\.|\\)/g, '$1');
					part = part.replace(/(\.|\\)\s+/g, '$1');
					part = part.replace(/\s+(::)/g, '$1');
					part = part.replace(/(::)\s+/g, '$1');
					part = part.replace(/\s+([})\]])/g, '$1');
					part = part.replace(/([{([])\s+/g, '$1');
					part = part.replace(/([^\s><=])(?=<>|<=|>=|=>|>=|=|<|>)/g, '$1 ');
					part = part.replace(/(<>|<=|>=|=>|>=|=|<|>)(?=[^\s><=])/g, '$1 ');
					part = part.replace(/(\S)(?=\/|<<|>>|\+)/g, '$1 ');
					part = part.replace(/(\/|<<|>>|\+)(?=\S)/g, '$1 ');
					part = part.replace(/([^\s:])(?=:[^:])/g, '$1 ');
					part = part.replace(/([^:]:)(?=[^\s:])/g, '$1 ');
					parts[index] = pb.text.removeExtensions(part, charBeforePart, charAfterPart);
				}
			});
			let formattedText = indentation.current + parts.join('');
			formattedText = formattedText.trimRight();
			if (formattedText !== text) {
				textEdits.push(TextEdit.replace(rg, formattedText));
			}
		}
		return Promise.resolve(textEdits);
	}
}