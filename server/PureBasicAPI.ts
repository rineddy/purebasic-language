import {
	ProposedFeatures,
	TextDocuments,
	createConnection
} from 'vscode-languageserver';

import { PureBasicCompletion } from './PureBasicCompletion';
import { PureBasicFormatter } from './PureBasicFormatter';
import { PureBasicHelpers } from './PureBasicHelpers';
import { PureBasicIndents } from './PureBasicIndents';
import { PureBasicSettings } from './PureBasicSettings';
import { PureBasicText } from './PureBasicText';
import { PureBasicValidation } from './PureBasicValidation';

export namespace pb {
	/**
	 * Provide functions used by several API components
	 */
	export let helpers = new PureBasicHelpers();
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
	export let indents = new PureBasicIndents();
	/**
	 * Provide functions used to analyze source code and retrieve diagnostic report
	 */
	export let validation = new PureBasicValidation();
	/**
	 * Provide functions used to save or load all language custom settings
	 */
	export let settings = new PureBasicSettings();
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

