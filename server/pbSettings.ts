import {
	ClientCapabilities,
	DidChangeConfigurationParams,
	InitializeParams,
	TextDocument
} from 'vscode-languageserver';

import pb from './pbAPI';

// Purebasic custom settings
export interface ICustomSettings {
	maxNumberOfProblems: number;
}

export class PureBasic_Settings {
	public initParams?: InitializeParams = undefined;
	public clientCapabilities?: ClientCapabilities = undefined;
	public hasWorkspaceConfigCapability: boolean = false;
	public hasWorkspaceFolderCapability: boolean = false;
	public hasDiagnosticRelatedInformationCapability: boolean = false;

	// The global settings, used when the `workspace/configuration` request is not supported by the client.
	// Please note that this is not the case when using this server with the client provided in this example
	// but could happen with other clients.
	private static DEFAULT_SETTINGS: ICustomSettings = { maxNumberOfProblems: 1000 };
	private globalSettings: ICustomSettings = PureBasic_Settings.DEFAULT_SETTINGS;
	// Cache the settings of all open documents
	private documentSettings: Map<string, Thenable<ICustomSettings>> = new Map();

	onInitialize(params: InitializeParams) {
		this.initParams = params;
		this.clientCapabilities = this.initParams.capabilities;
		// Does the client support the `workspace/configuration` request?
		// If not, we will fall back using global settings
		this.hasWorkspaceConfigCapability = !!(this.clientCapabilities.workspace && this.clientCapabilities.workspace.configuration);
		this.hasWorkspaceFolderCapability = !!(this.clientCapabilities.workspace && this.clientCapabilities.workspace.workspaceFolders);
		this.hasDiagnosticRelatedInformationCapability = !!(this.clientCapabilities.textDocument && this.clientCapabilities.textDocument.publishDiagnostics && this.clientCapabilities.textDocument.publishDiagnostics.relatedInformation);
	}

	changeDocumentSettings(change: DidChangeConfigurationParams) {
		if (!this.hasWorkspaceConfigCapability) {
			this.globalSettings = <ICustomSettings>(change.settings.purebasicLanguage || PureBasic_Settings.DEFAULT_SETTINGS);
		} else {
			// Reset all cached document settings
			this.documentSettings.clear();
		}
	}

	getDocumentSettings(doc: TextDocument): Thenable<ICustomSettings> {
		if (!this.hasWorkspaceConfigCapability) {
			return Promise.resolve(this.globalSettings);
		}
		let docSettings = this.documentSettings.get(doc.uri);
		if (!docSettings) {
			docSettings = pb.connection.workspace.getConfiguration({ scopeUri: doc.uri, section: 'purebasicLanguage' });
			this.documentSettings.set(doc.uri, docSettings);
		}
		return docSettings;
	}

	deleteDocumentSettings(doc: TextDocument) {
		this.documentSettings.delete(doc.uri);
	}
}

let pbSettings = new PureBasic_Settings();
export default pbSettings;