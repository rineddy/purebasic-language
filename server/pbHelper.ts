import {
	TextDocument,
	TextDocumentIdentifier,
} from 'vscode-languageserver';

import { pb } from './pbAPI';

/**
 * Find instance of existing text document identified by `docInfo`
 * @param docInfo
 */
export function FindDoc(docInfo: TextDocument | TextDocumentIdentifier | string): TextDocument | undefined {
	let doc: TextDocument | undefined;
	if (typeof (docInfo) === 'string') {
		doc = pb.documents.get(docInfo);
	}
	else if (TextDocumentIdentifier.is(docInfo)) {
		doc = pb.documents.get(docInfo.uri);
	}
	else if (TextDocument.is(docInfo)) {
		doc = docInfo;
	}
	return doc;
}