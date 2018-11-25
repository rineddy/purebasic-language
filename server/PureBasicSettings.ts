import {
	ClientCapabilities,
	DidChangeConfigurationParams,
	InitializeParams,
	TextDocument
} from 'vscode-languageserver';
import { ICustomSettings, pb } from './PureBasicAPI';

export class PureBasicSettings {
	public initParams?: InitializeParams;
	public clientCapabilities?: ClientCapabilities;
	public hasWorkspaceConfigCapability: boolean = false;
	public hasWorkspaceFolderCapability: boolean = false;
	public hasDiagnosticRelatedInformationCapability: boolean = false;

	/**
	 * Default settings
	 */
	private readonly DEFAULT_SETTINGS = <ICustomSettings>{
		diagnostics: {
			maxNumberOfProblems: 1000
		},
		indentationRules: [
			{
				regex: '\\b(Procedure|If)\\b',
				before: 0, after: 1
			},
			{
				regex: '\\b(EndProcedure|EndIf)\\b',
				before: -1, after: 0
			},
			{
				regex: '\\b(Select)\\b',
				before: 0, after: 2
			},
			{
				regex: '\\b(Case|Default)\\b',
				before: -1, after: 1
			},
			{
				regex: '\\b(EndSelect)\\b',
				before: -2, after: 0
			},
		]
	};
	/**
	 * Cache the settings of all open documents
	 */
	private documentSettings: Map<string, Thenable<ICustomSettings>> = new Map();

	/**
	 * Initializes cached document settings and technical settings
	 */
	public initialize(params: InitializeParams) {
		this.initParams = params;
		this.clientCapabilities = this.initParams.capabilities;
		// Does the client support the `workspace/configuration` request?
		// If not, we will fall back using global settings
		this.hasWorkspaceConfigCapability = !!(this.clientCapabilities.workspace && this.clientCapabilities.workspace.configuration);
		this.hasWorkspaceFolderCapability = !!(this.clientCapabilities.workspace && this.clientCapabilities.workspace.workspaceFolders);
		this.hasDiagnosticRelatedInformationCapability = !!(this.clientCapabilities.textDocument && this.clientCapabilities.textDocument.publishDiagnostics && this.clientCapabilities.textDocument.publishDiagnostics.relatedInformation);
		// The global settings, used when the `workspace/configuration` request is not supported by the client.
		// Please note that this is not the case when using this server with the client provided in this example
		// but could happen with other clients.
		if (!this.hasWorkspaceConfigCapability) {
			this.documentSettings.set('', Promise.resolve(pb.settings.DEFAULT_SETTINGS));
		}
	}
	/**
	 * Reset all cached document settings
	 */
	public change(change: DidChangeConfigurationParams) {
		this.documentSettings.clear();
		if (!this.hasWorkspaceConfigCapability) {
			let globalSettings = <ICustomSettings>(change.settings.purebasicLanguage || pb.settings.DEFAULT_SETTINGS);
			this.documentSettings.set('', Promise.resolve(globalSettings));
		}
	}
	/**
	 * Retrieves settings after opening document
	 */
	public load(doc: TextDocument): Thenable<ICustomSettings> {
		let settings = this.documentSettings.get(this.hasWorkspaceConfigCapability ? doc.uri : '');
		if (!settings) {
			settings = pb.connection.workspace.getConfiguration({ scopeUri: doc.uri, section: 'purebasicLanguage' });
			this.documentSettings.set(doc.uri, settings);
		}
		return settings;
	}
	/**
	 * Delete settings before closing document
	 */
	public remove(doc: TextDocument) {
		this.documentSettings.delete(doc.uri);
	}
}
