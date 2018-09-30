import {
	TextDocument
} from 'vscode-languageserver';

/**
 * Describes document indentation
 */
interface IDocumentIndents {
	indent: Map<number, number>;
}

export class PureBasicIndents {
	/**
	 * Cache the indentation of all open documents
	 */
	private documentIndents: Map<string, Thenable<IDocumentIndents>> = new Map();

	public load(doc: TextDocument): Thenable<IDocumentIndents> {
		let indents = this.documentIndents.get(doc.uri);
		if (!indents) {
			indents = Promise.resolve(<IDocumentIndents>{ indent: new Map<number, number>() });
			this.documentIndents.set(doc.uri, indents);
		}
		return indents;
	}

	public remove(doc: TextDocument) {
		this.documentIndents.delete(doc.uri);
	}
}