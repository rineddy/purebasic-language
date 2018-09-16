import * as pbCompletion from './pbCompletion';
import * as pbDocFormatter from './pbDocFormatter';
import * as pbDocValidation from './pbDocValidation';

import {
	Connection,
	ProposedFeatures,
	TextDocuments,
	createConnection
} from 'vscode-languageserver';

import pbSettings from './pbSettings';

export class PureBasicAPI {
	/**
	 * handle code auto completion
	 */
	public completion = pbCompletion;
	/**
	 * used to format and beautify source code
	 */
	public formatter = pbDocFormatter;
	/**
	 * used to analyze source code and retrieve diagnostic report
	 */
	public validation = pbDocValidation;
	/**
	 * used to store all settings
	 */
	public settings = pbSettings;
	/**
	 * Create a connection for the server. The connection uses Node's IPC as a transport.
	 * Also include all preview / proposed LSP features.
	 */
	public connection: Connection = createConnection(ProposedFeatures.all);
	/**
	 * Create a simple text document manager. The text document manager
	 * supports full document sync only
	 */
	public documents: TextDocuments = new TextDocuments();
}

let pb: PureBasicAPI = new PureBasicAPI();
export default pb;