import { ICustomReadLine, pb } from './PureBasicAPI';
import {
	Range,
	TextDocument,
	TextDocumentIdentifier,
	TextDocuments,
} from 'vscode-languageserver';

export class PureBasicDocumentation extends TextDocuments {
	/**
	 * Find instance of existing text document identified by `docInfo`
	 */
	public find(docInfo: TextDocument | TextDocumentIdentifier | string): Thenable<TextDocument> {
		let doc: TextDocument | undefined;
		if (typeof (docInfo) === 'string') {
			doc = pb.documentation.get(docInfo);
		}
		else if (TextDocumentIdentifier.is(docInfo)) {
			doc = pb.documentation.get(docInfo.uri);
		}
		else if (TextDocument.is(docInfo)) {
			doc = docInfo;
		}
		return doc ? Promise.resolve(doc) : Promise.reject(`Invalid docInfo: ${docInfo.toString()}`);
	}
	/**
	 * Read doc line
	 * @param doc
	 * @param line line to read
	 * @param lineCharacter line last character position
	 */
	public readLine(doc: TextDocument, line: number, lineCharacter: number): ICustomReadLine {
		const rg = Range.create(line, 0, line, lineCharacter);
		return {
			lineText: doc.getText(rg),
			lineRange: rg,
		};
	}
}
