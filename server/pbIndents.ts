import {
	TextDocument
} from 'vscode-languageserver';

export namespace pbIndents {
	/**
	 * Describes document indentation
	 */
	export interface IDocumentIndents {
		indent: Map<number, number>;
	}
	/**
	 * Cache the indentation of all open documents
	 */
	let documentIndents: Map<string, Thenable<IDocumentIndents>> = new Map();

	export function load(doc: TextDocument): Thenable<IDocumentIndents> {
		let docIndents = documentIndents.get(doc.uri);
		if (!docIndents) {
			docIndents = Promise.resolve(<IDocumentIndents>{
				indent: new Map<number, number>()
			});
			documentIndents.set(doc.uri, docIndents);
		}
		return docIndents;
	}

	export function remove(doc: TextDocument) {
		documentIndents.delete(doc.uri);
	}
}
}
