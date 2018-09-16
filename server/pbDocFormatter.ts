import {
	DocumentFormattingParams,
	DocumentOnTypeFormattingParams,
	DocumentRangeFormattingParams,
	TextDocument,
	TextEdit
} from 'vscode-languageserver';

import pb from './pbAPI';

export class PureBasicDocFormatter {
	/**
	 * Format whole doc
	 * @param formattingParams
	 */
	public formatDocument(formattingParams: DocumentFormattingParams): TextEdit[] {
		// docFormattingParams.options.insertSpaces;
		// let doc: TextDocument = documents.get(docFormattingParams.textDocument.uri) as TextDocument;
		// doc.getText();
		return [];
	}

	/**
	 * Format doc selected text
	 * @param formattingParams
	 */
	public formatDocumentRange(formattingParams: DocumentRangeFormattingParams): TextEdit[] {
		formattingParams.options.insertSpaces;
		let doc: TextDocument = pb.documents.get(formattingParams.textDocument.uri) as TextDocument;
		let txt = doc.getText();
		return [];
	}

	/**
	 * Format doc when user is typing
	 * @param formattingParams
	 */
	public formatDocumentOnType(formattingParams: DocumentOnTypeFormattingParams): TextEdit[] {
		// docFormattingParams.options.insertSpaces;
		// let doc: TextDocument = documents.get(docFormattingParams.textDocument.uri) as TextDocument;
		// doc.getText();
		return [];
	}

}
