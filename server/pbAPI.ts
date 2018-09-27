import {
	ProposedFeatures,
	TextDocuments,
	createConnection
} from 'vscode-languageserver';

import { pbCompletion } from './pbCompletion';
import { pbFormatter } from './pbFormatter';
import { pbHelpers } from './pbHelpers';
import { pbIndentation } from './pbIndentation';
import { pbSettings } from './pbSettings';
import { pbText } from './pbText';
import { pbValidation } from './pbValidation';

export namespace pb {
	/**
	 * Provide functions used by several API components
	 */
	export let helpers = pbHelpers;
	/**
	 * Provide functions used to examine and modify text from source code
	 */
	export let text = pbText;
	/**
	 * Provide functions used to display code autocompletion list
	 */
	export let completion = pbCompletion;
	/**
	 * Provide functions used to beautify source code by following some formatting rules
	 */
	export let formatter = pbFormatter;
	/**
	 * Provide functions used to indent source code
	 */
	export let indentation = pbIndentation;
	/**
	 * Provide functions used to analyze source code and retrieve diagnostic report
	 */
	export let validation = pbValidation;
	/**
	 * Provide functions used to save or load all language custom settings
	 */
	export let settings = pbSettings;
	/**
	 * Create a connection for the server. The connection uses Node's IPC as a transport.
	 * Also include all preview / proposed LSP features.
	 */
	export let connection = createConnection(ProposedFeatures.all);
	/**
	 * Create a simple text document manager. The text document manager
	 * supports full document sync only
	 */
	export let documents = new TextDocuments();
}
