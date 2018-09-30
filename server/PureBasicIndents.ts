import {
	Range,
	TextDocument
} from 'vscode-languageserver';

import { pb } from './PureBasicAPI';

/**
 * Represents document indentation
 */
interface IDocumentIndents {
	lineIndentations: Map<number, number>;
}

export class PureBasicIndentation {
	/**
	 * Cache the indents of all open documents
	 */
	private documentIndents: Map<string, Thenable<IDocumentIndents>> = new Map();
	/**
	 * Retrieves indents after opening document
	 */
	public load(doc: TextDocument): Thenable<IDocumentIndents> {
		let indents = this.documentIndents.get(doc.uri);
		if (!indents) {
			indents = pb.indents.remap(doc, <IDocumentIndents>{}, 0, doc.lineCount - 1);
			this.documentIndents.set(doc.uri, indents);
		}
		return indents;
	}
	/**
	 * Delete indents before closing document
	 */
	public remove(doc: TextDocument) {
		this.documentIndents.delete(doc.uri);
	}
	/**
	 * Remap indents of open document between start line and end line
	 */
	private remap(doc: TextDocument, original: IDocumentIndents, startLine: number, endLine: number): Thenable<IDocumentIndents> {
		let textEdits: TextEdit[] = [];
		for (let line = startLine; line <= endLine; line++) {
			let rg: Range = Range.create(line, 0, line, Number.MAX_SAFE_INTEGER);
			let text = doc.getText(rg);

		}
		return textEdits;
	}
}