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
			let text = pb.text.removeLineBreak(doc.getText(rg));
			let textParts = pb.text.splitBySpacingOrStringOrComment(text);
			textParts.forEach((part, index, parts) => {
				if (index === 0 && pb.text.startsWithSpacing(part)) {
					return;
				}
				else if (!pb.text.startsWithStringOrComment(part)) {
					let charBeforePart = (index > 0) ? parts[index - 1].substr(-1) : '';
					let charAfterPart = (index < parts.length - 1) ? parts[index + 1].substr(0, 1) : '';
					part = pb.text.addExtensions(part, charBeforePart, charAfterPart);
					part = part.replace(/\s+/g, ' ');
					part = part.replace(/(\s*),(?=\S)/g, ', ');
					part = part.replace(/\s+[.]|[.]\s+/g, '.');
					part = part.replace(/([{([])\s+(?=\S)/g, '$1');
					part = part.replace(/(\S)\s+(?=[})\]])/g, '$1');
					part = part.replace(/(\S)(?=<>|<=|>=|=>|>=|\+)/g, '$1 ');
					part = part.replace(/(<>|<=|>=|=>|>=|\+)(?=\S)/g, '$1 ');
					parts[index] = pb.text.removeExtensions(part, charBeforePart, charAfterPart);
				}
			});
			let formattedText = textParts.join('');
			if (formattedText !== text) {
				textEdits.push(TextEdit.replace(rg, formattedText));
			}
		}
		return textEdits;
	}
}