import {
	Connection,
	ProposedFeatures,
	TextDocuments,
	createConnection
} from 'vscode-languageserver';

import { PureBasicCompletion } from './pbCompletion';
import { PureBasicDocFormatter } from './pbDocFormatter';
import { PureBasicDocValidation } from './pbDocValidation';
import { PureBasicHelpers } from './pbHelper';
import { PureBasicSettings } from './pbSettings';

export class PureBasicAPI {
	/**
	 * provide helper functions used by several API components
	 */
	public helpers = new PureBasicHelpers();
	/**
	 * handle code auto completion
	 */
	public completion = new PureBasicCompletion();
	/**
	 * used to format and beautify source code
	 */
	public formatter = new PureBasicDocFormatter();
	/**
	 * used to analyze source code and retrieve diagnostic report
	 */
	public validation = new PureBasicDocValidation();
	/**
	 * used to store all language custom settings
	 */
	public settings = new PureBasicSettings();
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