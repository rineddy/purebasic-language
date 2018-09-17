import {
	DocumentFormattingParams,
	DocumentOnTypeFormattingParams,
	DocumentRangeFormattingParams,
	TextEdit
} from 'vscode-languageserver';

import pb from './pbAPI';

export class PureBasicDocFormatter {
	/**
	 * Format whole doc
	 * @param formattingParams
	 */
	public formatDocument(formattingParams: DocumentFormattingParams): TextEdit[] {
		let txt = pb.helpers.ReadDocText(formattingParams.textDocument);
		return [];
	}

	/**
	 * Format doc selected text
	 * @param formattingParams
	 */
	public formatDocumentRange(formattingParams: DocumentRangeFormattingParams): TextEdit[] {
		let lines = pb.helpers.ReadDocLines(formattingParams.textDocument, formattingParams.range);
		formattingParams.options.insertSpaces;
		return [
			/*TextEdit.replace({
				start: {
					line: 1
					, character: 1
				},
				end: {
					line: 1
					, character: 10
				}
			}, 'xxxxx')*/
		];
	}

	/**
	 * Format doc when user is typing
	 * @param formattingParams
	 */
	public formatDocumentOnType(formattingParams: DocumentOnTypeFormattingParams): TextEdit[] {
		// let txt = pb.helpers.ReadDocText(formattingParams.textDocument, formattingParams.position.line)
		return [];
	}

}
