import {
	Range,
	TextDocument,
	TextDocumentIdentifier,
} from 'vscode-languageserver';

import pb from './pbAPI';

export class PureBasicHelpers {
	/**
	 * Extend selected range to full line range
	 * @param doc
	 * @param selectionRange
	 */
	public SelectDocRange(doc: TextDocument, selectionRange?: Range | number[]): Range {
		let extendedRange: Range | undefined;
		if (doc) {
			if (!selectionRange) {
				extendedRange = Range.create(0, 0, doc.lineCount - 1, -1);
			}
			else if (Range.is(selectionRange)) {
				extendedRange = Range.create(selectionRange.start.line, 0, selectionRange.end.line, -1);
			}
			else if (Array.isArray(selectionRange) && selectionRange.length === 2) {
				let startLine = Math.min(selectionRange[0], doc.lineCount - 1);
				let endLine = Math.min(selectionRange[1], doc.lineCount - 1);
				extendedRange = Range.create(Math.min(startLine, endLine), 0, Math.max(startLine, endLine), -1);
			}
		}
		if (!extendedRange) { throw new Error('Failed to extend to full line selection!'); }
		return extendedRange;
	}
	/**
	 * Find instance of existing text document identified by `docInfo`
	 * @param docInfo
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
	/**
	 * Read text from document
	 * @param docToRead
	 * @param selectionRange optional selection range of document
	 */
	public ReadDocText(docToRead: TextDocument | TextDocumentIdentifier | string, selectionRange?: Range): string | undefined {
		let doc = this.FindDoc(docToRead);
		return doc ? doc.getText(selectionRange) : undefined;
	}
	/**
	 * Read lines from document
	 * @param docToRead
	 * @param selectionRange optional selection range of document
	 */
	public ReadDocLines(docToRead: TextDocument | TextDocumentIdentifier | string, selectionRange?: Range): string[] | undefined {
		let doc = this.FindDoc(docToRead);
		if (doc) {
			let startLine = selectionRange ? selectionRange.start.line : 0;
			let endLine = selectionRange ? selectionRange.end.line : doc.lineCount - 1;
			let lines: string[] = [];
			for (let line = startLine; line <= endLine; line++) {
				lines.push();
			}
		}
		return undefined;
	}
}