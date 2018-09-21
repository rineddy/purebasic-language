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
	 * @param formattingParams
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
			let formatted = original.replace(/\s+/gi, ' ');
			// if (formatted !== original) {
			textEdits.push(TextEdit.replace(rg, formatted));
			// }
		}
		return textEdits;
	}
}