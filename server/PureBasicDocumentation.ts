import {
	TextDocument,
	TextDocumentIdentifier,
	TextDocuments,
} from 'vscode-languageserver';

import { pb } from './PureBasicAPI';

export class PureBasicDocuments extends TextDocuments {
	/**
	 * Find instance of existing text document identified by `docInfo`
	 */
	public find(docInfo: TextDocument | TextDocumentIdentifier | string): Thenable<TextDocument> {
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
		return doc ? Promise.resolve(doc) : Promise.reject(`Invalid docInfo: ${docInfo.toString()}`);
	}
}
