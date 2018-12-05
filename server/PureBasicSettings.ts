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
				regex: /\b(Procedure|If|CompilerIf|DataSection|DeclareModule|Enumeration)\b/i,
				before: 0, after: 1
			},
			{
				regex: /\b(EndProcedure|EndIf|CompilerEndIf|EndDataSection|EndDeclareModule|EndEnumeration)\b/i,
				before: -1, after: 0
			},
			{
				regex: /\b(Else|ElseIf|Case|Default|CompilerElse|CompilerElseIf|CompilerCase|CompilerDefault)\b/i,
				before: -1, after: 1
			},
			{
				regex: /\b(Select|CompilerSelect)\b/i,
				before: 0, after: 2
			},
			{
				regex: /\b(EndSelect|CompilerEndSelect)\b/i,
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
			let globalSettings = Promise.resolve(<ICustomSettings>(change.settings.purebasicLanguage || pb.settings.DEFAULT_SETTINGS));
			this.saveDocumentSettings('', globalSettings);
		}
	}
	/**
	 * Load settings after opening document
	 * @param doc
	 */
	public load(doc: TextDocument): Thenable<ICustomSettings> {
		let settings = this.documentSettings.get(this.hasWorkspaceConfigCapability ? doc.uri : '');
		if (!settings) {
			settings = pb.connection.workspace.getConfiguration({ scopeUri: doc.uri, section: 'purebasicLanguage' });
			this.saveDocumentSettings(doc.uri, settings);
		}
		return settings;
	}
	/**
	 * Delete settings before closing document
	 * @param doc
	 */
	public remove(doc: TextDocument) {
		this.documentSettings.delete(doc.uri);
	}
	/**
	 * Save settings in dictionary after converting indent rules from JSON into regex
	 * @param docUri
	 * @param settings
	 */
	private saveDocumentSettings(docUri: string, settings: Thenable<ICustomSettings>) {
		settings.then(newSettings => {
			newSettings.indentationRules.forEach(r => {
				// convert indent rules from string to RegExp
				if (typeof (r.regex) === 'string') { r.regex = new RegExp(r.regex, r.flags); }
			});
			return newSettings;
		});
		this.documentSettings.set(docUri, settings);
	}
}
