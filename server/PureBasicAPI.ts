import {
	ProposedFeatures,
	createConnection
} from 'vscode-languageserver';

import { PureBasicCompletion } from './PureBasicCompletion';
import { PureBasicDocuments } from './PureBasicDocuments';
import { PureBasicFormatter } from './PureBasicFormatter';
import { PureBasicIndentator } from './PureBasicIndentator';
import { PureBasicSettings } from './PureBasicSettings';
import { PureBasicText } from './PureBasicText';
import { PureBasicValidator } from './PureBasicValidator';

export namespace pb {
	/**
	 * Provide functions used to examine and modify text from source code
	 */
	export let text = new PureBasicText();
	/**
	 * Provide functions used to display code autocompletion list
	 */
	export let completion = new PureBasicCompletion();
	/**
	 * Provide functions used to beautify source code by following some formatting rules
	 */
	export let formatter = new PureBasicFormatter();
	/**
	 * Provide functions used to indent source code
	 */
	export let indentator = new PureBasicIndentator();
	/**
	 * Provide functions used to analyze source code and retrieve diagnostic report
	 */
	export let validator = new PureBasicValidator();
	/**
	 * Provide functions used to save or load all language custom settings
	 */
	export let settings = new PureBasicSettings();
	/**
	 * Create a simple text document manager. The text document manager
	 * supports full document sync only
	 */
	export let documents = new PureBasicDocuments();
	/**
	 * Create a connection for the server. The connection uses Node's IPC as a transport.
	 * Also include all preview / proposed LSP features.
	 */
	export let connection = createConnection(ProposedFeatures.all);
}

