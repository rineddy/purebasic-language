import {
	ClientCapabilities,
	DidChangeConfigurationParams,
	InitializeParams,
	TextDocument
} from 'vscode-languageserver';

import pb from './pbAPI';

/**
 * All Purebasic settings customized by user
 */
export interface ICustomizableSettings {
	diagnostics: {
		maxNumberOfProblems: number;
	};
}

export class PureBasicSettings {
	public initParams?: InitializeParams;
	public clientCapabilities?: ClientCapabilities;
	public hasWorkspaceConfigCapability: boolean = false;
	public hasWorkspaceFolderCapability: boolean = false;
	public hasDiagnosticRelatedInformationCapability: boolean = false;

	// The global settings, used when the `workspace/configuration` request is not supported by the client.
	// Please note that this is not the case when using this server with the client provided in this example
	// but could happen with other clients.
	private static DEFAULT_SETTINGS: ICustomizableSettings = {
		diagnostics: {
			maxNumberOfProblems: 1000
		}
	};
	private globalSettings: ICustomizableSettings = PureBasicSettings.DEFAULT_SETTINGS;
	// Cache the settings of all open documents
	private documentSettings: Map<string, Thenable<ICustomizableSettings>> = new Map();


	public onInitialize = (params: InitializeParams) => {
		this.initParams = params;
		this.clientCapabilities = this.initParams.capabilities;
		// Does the client support the `workspace/configuration` request?
		// If not, we will fall back using global settings
		this.hasWorkspaceConfigCapability = !!(this.clientCapabilities.workspace && this.clientCapabilities.workspace.configuration);
		this.hasWorkspaceFolderCapability = !!(this.clientCapabilities.workspace && this.clientCapabilities.workspace.workspaceFolders);
		this.hasDiagnosticRelatedInformationCapability = !!(this.clientCapabilities.textDocument && this.clientCapabilities.textDocument.publishDiagnostics && this.clientCapabilities.textDocument.publishDiagnostics.relatedInformation);
	}

	public changeDocumentSettings = (change: DidChangeConfigurationParams) => {
		if (!this.hasWorkspaceConfigCapability) {
			this.globalSettings = <ICustomizableSettings>(change.settings.purebasicLanguage || PureBasicSettings.DEFAULT_SETTINGS);
		} else {
			// Reset all cached document settings
			this.documentSettings.clear();
		}
	}

	public getDocumentSettings = (doc: TextDocument): Thenable<ICustomizableSettings> => {
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

	public deleteDocumentSettings = (doc: TextDocument) => {
		this.documentSettings.delete(doc.uri);
	}
}
