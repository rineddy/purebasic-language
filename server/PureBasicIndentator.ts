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

export class PureBasicIndentator {
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
			indents = pb.indentator.remap(doc, 0, doc.lineCount - 1);
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
	private remap(doc: TextDocument, startLine: number, endLine: number, indents?: Thenable<IDocumentIndents>): Thenable<IDocumentIndents> {
		if (!indents) {
			indents = Promise.resolve(<IDocumentIndents>{ lineIndentations: new Map<number, number>() });
		}
		indents.then(res => {
			for (let line = startLine; line <= endLine; line++) {
				let rg: Range = Range.create(line, 0, line, Number.MAX_SAFE_INTEGER);
				let text = doc.getText(rg).replace(pb.text.FINDS_STRING_OR_COMMENT, '');
				let countIndents = (text.match(/\b(If|Select|Procedure)\b/gi) || []).length;
				let countUnindents = (text.match(/\b(EndIf|EndSelect|EndProcedure)\b/gi) || []).length;
				if ((countIndents - countUnindents) !== 0) {
					res.lineIndentations.set(line, countIndents - countUnindents);
				} else if (res.lineIndentations.has(line)) {
					res.lineIndentations.delete(line);
				}
			}
			return res;
		});
		return indents;
	}
}