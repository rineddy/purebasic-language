'use strict';

import {
	DocumentFormattingParams,
	DocumentOnTypeFormattingParams,
	DocumentRangeFormattingParams,
	Range,
	TextDocument,
	TextEdit,
} from 'vscode-languageserver';

import pb from './pbAPI';

export class PureBasicDocFormatter {
	/**
	 * Format whole doc
	 * @param params
	 */
	public formatDocument = (params: DocumentFormattingParams): TextEdit[] => {
		let doc = pb.helpers.FindDoc(params.textDocument);
		return doc ? this.formatDocumentLines(doc, Range.create(0, 0, doc.lineCount - 1, Number.MAX_SAFE_INTEGER)) : [];
	}
	/**
	 * Format doc selected text
	 * @param params
	 */
	public formatDocumentRange = (params: DocumentRangeFormattingParams): TextEdit[] => {
		let doc = pb.helpers.FindDoc(params.textDocument);
		return doc ? this.formatDocumentLines(doc, Range.create(params.range.start.line, 0, params.range.end.line, params.range.end.character)) : [];
	}
	/**
	 * Format doc when user is typing
	 * @param params
	 */
	public formatDocumentOnType = (params: DocumentOnTypeFormattingParams): TextEdit[] => {
		let doc = pb.helpers.FindDoc(params.textDocument);
		return doc ? this.formatDocumentLines(doc, Range.create(params.position.line, 0, params.position.line, params.position.character)) : [];
	}

	private formatDocumentLines = (doc: TextDocument, selection: Range): TextEdit[] => {
		let textEdits: TextEdit[] = [];
		for (let line = selection.start.line; line <= selection.end.line; line++) {
			let rg: Range = Range.create(line, 0, line, line < selection.end.line ? Number.MAX_SAFE_INTEGER : selection.end.character);
			let original = doc.getText(rg);
			let parts = original.split(/(^\s+|".+?"|'.+?'|["';].*$)/gm);
			parts.forEach((part, index, parts) => {
				if (part.length === 0) {
					return;
				}
				else if (index === 1 && part.match(/^\s/) !== null) {
					return;
				}
				else if (part.match(/^[^"';]/) !== null) {
					part = part.replace(/\s+/g, ' ');
					part = part.replace(/,(?=\S)/g, ', ');
					part = part.replace(/([{([])\s+(\S)|(\S)\s+([})\]])/g, '$1$2$3$4');
					parts[index] = part;
				}
			});
			let formatted = parts.join('');
			if (formatted !== original) {
				textEdits.push(TextEdit.replace(rg, formatted));
			}
		}
		return textEdits;
	}
}