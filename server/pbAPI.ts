import {
	ProposedFeatures,
	TextDocuments,
	createConnection
} from 'vscode-languageserver';

import { pbCompletion } from './pbCompletion';
import { pbFormatter } from './formatter/pbFormatter';
import { pbHelpers } from './pbHelper';
import { pbSettings } from './pbSettings';
import { pbValidation } from './pbValidation';

export namespace pb {
	/**
	 * provide helper functions used by several API components
	 */
	export let helpers = pbHelpers;
	/**
	 * handle code auto completion
	 */
	export let completion = pbCompletion;
	/**
	 * used to format and beautify source code
	 */
	export let formatter = pbFormatter;
	/**
	 * used to analyze source code and retrieve diagnostic report
	 */
	export let validation = pbValidation;
	/**
	 * used to store all language custom settings
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
