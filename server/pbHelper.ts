import {
	Range,
	TextDocument,
	TextDocumentIdentifier,
	TextEdit,
} from 'vscode-languageserver';

import pb from './pbAPI';

export class PureBasicHelpers {
	/**
	 * Select document full line range
	 * @param doc
	 * @param selectionRange
	 */
	public SelectDocFullLineRange(doc: TextDocument, selectionRange?: Range | number[] | number): Range {
		let extendedRange: Range | undefined;
		let startLine: number | undefined, endLine: number | undefined;
		if (doc) {
			if (typeof (selectionRange) === 'number') {
				startLine = endLine = selectionRange;
			}
			else if (Range.is(selectionRange)) {
				startLine = selectionRange.start.line;
				endLine = selectionRange.end.line;
			}
			else if (Array.isArray(selectionRange) && selectionRange.length === 2) {
				startLine = Math.min(selectionRange[0], selectionRange[1]);
				endLine = Math.max(selectionRange[0], selectionRange[1]);
			} else if (!selectionRange) {
				startLine = 0;
				endLine = doc.lineCount - 1;
			}
			if (startLine && endLine) {
				startLine = Math.min(startLine, doc.lineCount - 1);
				endLine = Math.min(endLine, doc.lineCount - 1);
				extendedRange = Range.create(startLine, 0, endLine, -1);
			}
		}
		if (!extendedRange) { throw new Error('Failed to select doc full line range!'); }
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
		let lines: string[] | undefined;
		if (doc) {
			let startLine = selectionRange ? selectionRange.start.line : 0;
			let endLine = selectionRange ? selectionRange.end.line : doc.lineCount - 1;
			lines = [];
			for (let lineNumber = startLine; lineNumber <= endLine; lineNumber++) {
				let line = doc.getText(Range.create(lineNumber, 0, lineNumber, Number.MAX_SAFE_INTEGER));
				lines.push(line);
			}
		}
		return lines;
	}
}