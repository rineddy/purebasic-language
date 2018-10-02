import {
	TextDocument,
	TextDocumentIdentifier,
} from 'vscode-languageserver';

import { pb } from './PureBasicAPI';

export class PureBasicHelper {
	/**
	 * Find instance of existing text document identified by `docInfo`
	 */
	public FindDoc(docInfo: TextDocument | TextDocumentIdentifier | string): TextDocument | undefined {
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
}
