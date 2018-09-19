import {
	DocumentFormattingParams,
	DocumentOnTypeFormattingParams,
	DocumentRangeFormattingParams,
	Range,
	TextEdit
} from 'vscode-languageserver';

import pb from './pbAPI';

export class PureBasicDocFormatter {
	/**
	 * Format whole doc
	 * @param params
	 */
	public formatDocument(params: DocumentFormattingParams): TextEdit[] {
		let txt = pb.helpers.ReadDocText(params.textDocument);
		return [];
	}

	/**
	 * Format doc selected text
	 * @param params
	 */
	public formatDocumentRange(params: DocumentRangeFormattingParams): TextEdit[] {
		let doc = pb.helpers.FindDoc(params.textDocument);

		let edits = [];
		if (doc) {
			for (let line = params.range.start.line; line <= params.range.end.line; line++) {
				let rg: Range = Range.create(line, 0, line, Number.MAX_SAFE_INTEGER);
				let src = doc.getText(rg);
				let out = src.replace(/\s+/gi, ' ');
				edits.push(TextEdit.replace(rg, out));
			}
		}
		return edits;
	}

	/**
	 * Format doc when user is typing
	 * @param formattingParams
	 */
	public formatDocumentOnType(params: DocumentOnTypeFormattingParams): TextEdit[] {
		// let txt = pb.helpers.ReadDocText(formattingParams.textDocument, formattingParams.position.line)
		return [];
	}

}
