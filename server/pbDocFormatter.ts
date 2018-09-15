import {
	DocumentFormattingParams,
	DocumentOnTypeFormattingParams,
	DocumentRangeFormattingParams,
	TextDocument,
	TextEdit
} from 'vscode-languageserver';

import pb from './pbAPI';

/**
 * Format whole doc
 * @param formattingParams
 */
export function formatDocument(formattingParams: DocumentFormattingParams): TextEdit[] {
	// docFormattingParams.options.insertSpaces;
	// let doc: TextDocument = documents.get(docFormattingParams.textDocument.uri) as TextDocument;
	// doc.getText();
	return [];
}

/**
 * Format doc selected text
 * @param formattingParams
 */
export function formatDocumentRange(formattingParams: DocumentRangeFormattingParams): TextEdit[] {
	formattingParams.options.insertSpaces;
	let doc: TextDocument = pb.documents.get(formattingParams.textDocument.uri) as TextDocument;
	let txt = doc.getText();
	return [];
}

/**
 * Format doc when user is typing
 * @param formattingParams
 */
export function formatDocumentOnType(formattingParams: DocumentOnTypeFormattingParams): TextEdit[] {
	// docFormattingParams.options.insertSpaces;
	// let doc: TextDocument = documents.get(docFormattingParams.textDocument.uri) as TextDocument;
	// doc.getText();
	return [];
}

