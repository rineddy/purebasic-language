import {
	DocumentFormattingParams,
	DocumentOnTypeFormattingParams,
	DocumentRangeFormattingParams,
	Range,
	TextDocument,
	TextEdit,
} from 'vscode-languageserver';

import { pb } from './pbAPI';

export namespace pbFormatter {
	/**
	 * Format whole doc
	 * @param params
	 */
	export function formatDocument(params: DocumentFormattingParams): TextEdit[] {
		let doc = pb.helpers.FindDoc(params.textDocument);
		return doc ? formatDocumentLines(doc, Range.create(0, 0, doc.lineCount - 1, Number.MAX_SAFE_INTEGER)) : [];
	}
	/**
	 * Format doc selected text
	 * @param params
	 */
	export function formatDocumentRange(params: DocumentRangeFormattingParams): TextEdit[] {
		let doc = pb.helpers.FindDoc(params.textDocument);
		return doc ? formatDocumentLines(doc, Range.create(params.range.start.line, 0, params.range.end.line, params.range.end.character)) : [];
	}
	/**
	 * Format doc when user is typing
	 * @param params
	 */
	export function formatDocumentOnType(params: DocumentOnTypeFormattingParams): TextEdit[] {
		let doc = pb.helpers.FindDoc(params.textDocument);
		return doc ? formatDocumentLines(doc, Range.create(params.position.line, 0, params.position.line, params.position.character)) : [];
	}

	function formatDocumentLines(doc: TextDocument, selection: Range): TextEdit[] {
		let textEdits: TextEdit[] = [];
		for (let line = selection.start.line; line <= selection.end.line; line++) {
			let rg: Range = Range.create(line, 0, line, line < selection.end.line ? Number.MAX_SAFE_INTEGER : selection.end.character);
			let text = doc.getText(rg);
			let { indentation, parts } = pb.text.splitParts(text);
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
					part = part.replace(/(\S)(?=<>|<=|>=|=>|>=|=)/g, '$1 ');
					part = part.replace(/(<>|<=|>=|=>|>=|=)(?=\S)/g, '$1 ');
					part = part.replace(/(\S)(?=\/|<<|>>|\+)/g, '$1 ');
					part = part.replace(/(\/|<<|>>|\+)(?=\S)/g, '$1 ');
					part = part.replace(/([^\s:])(?=:[^:])/g, '$1 ');
					part = part.replace(/([^:]:)(?=[^\s:])/g, '$1 ');
					parts[index] = pb.text.removeExtensions(part, charBeforePart, charAfterPart);
				}
			});
			let formattedText = indentation + parts.join('');
			formattedText = formattedText.trimRight();
			if (formattedText !== text) {
				textEdits.push(TextEdit.replace(rg, formattedText));
			}
		}
		return textEdits;
	}
}