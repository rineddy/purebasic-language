import {
	TextDocument
} from 'vscode-languageserver';
import { pb } from './pbAPI';

export namespace pbIndentation {
	export function load(doc: TextDocument) {
		let text = doc.getText();
	}
	export function remove(doc: TextDocument) {
		let text = doc.getText();
	}
}
}
