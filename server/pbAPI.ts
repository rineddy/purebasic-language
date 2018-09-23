import {
	ProposedFeatures,
	TextDocuments,
	createConnection
} from 'vscode-languageserver';

import { pbCompletion } from './pbCompletion';
import { pbFormatter } from './pbFormatter';
import { pbHelpers } from './pbHelpers';
import { pbSettings } from './pbSettings';
import { pbText } from './pbText';
import { pbValidation } from './pbValidation';

export namespace pb {
	/**
	 * Provide helper functions used by several API components
	 */
	export let helpers = pbHelpers;
	/**
	 * Used to examine and modify text from source code
	 */
	export let text = pbText;
	/**
	 * Used to display code autocompletion list
	 */
	export let completion = pbCompletion;
	/**
	 * Used to beautify source code by following some formatting rules
	 */
	export let formatter = pbFormatter;
	/**
	 * Used to analyze source code and retrieve diagnostic report
	 */
	export let validation = pbValidation;
	/**
	 * Used to save or load all language custom settings
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
