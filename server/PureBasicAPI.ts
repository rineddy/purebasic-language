import {
	ProposedFeatures,
	createConnection
} from 'vscode-languageserver';

import { PureBasicCompletion } from './PureBasicCompletion';
import { PureBasicDocuments } from './PureBasicDocuments';
import { PureBasicFormatter } from './PureBasicFormatter';
import { PureBasicIndentation } from './PureBasicIndentator';
import { PureBasicSettings } from './PureBasicSettings';
import { PureBasicText } from './PureBasicText';
import { PureBasicValidation } from './PureBasicValidator';

export namespace pb {
	/**
	 * Provide functions used to examine and modify text from source code
	 */
	export const text = new PureBasicText();
	/**
	 * Provide functions used to beautify source code by following some formatting rules
	 */
	export const formatter = new PureBasicFormatter();
	/**
	 * Provide functions used to display code autocompletion list
	 */
	export const completion = new PureBasicCompletion();
	/**
	 * Provide functions used to indent source code
	 */
	export const indentation = new PureBasicIndentation();
	/**
	 * Provide functions used to analyze source code and retrieve diagnostic report
	 */
	export const validation = new PureBasicValidation();
	/**
	 * Provide functions used to save or load all language custom settings
	 */
	export const settings = new PureBasicSettings();
	/**
	 * Create a simple text document manager. The text document manager
	 * supports full document sync only
	 */
	export const documents = new PureBasicDocuments();
	/**
	 * Create a connection for the server. The connection uses Node's IPC as a transport.
	 * Also include all preview / proposed LSP features.
	 */
	export const connection = createConnection(ProposedFeatures.all);
}