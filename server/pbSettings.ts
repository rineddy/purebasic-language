import {
	ClientCapabilities,
	DidChangeConfigurationParams,
	InitializeParams,
	TextDocument
} from 'vscode-languageserver';

import pb from './pbAPI';

export let initParams: InitializeParams;
export let clientCapabilities: ClientCapabilities;
export let hasWorkspaceConfigCapability: boolean = false;
export let hasWorkspaceFolderCapability: boolean = false;
export let hasDiagnosticRelatedInformationCapability: boolean = false;

// Purebasic custom settings
export interface PureBasicSettings {
	maxNumberOfProblems: number;
}
// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: PureBasicSettings = { maxNumberOfProblems: 1000 };
let globalSettings: PureBasicSettings = defaultSettings;
// Cache the settings of all open documents
let documentSettings: Map<string, Thenable<PureBasicSettings>> = new Map();


export function onInitialize(params: InitializeParams) {
	initParams = params;
	clientCapabilities = initParams.capabilities;
	// Does the client support the `workspace/configuration` request?
	// If not, we will fall back using global settings
	hasWorkspaceConfigCapability = !!(clientCapabilities.workspace && clientCapabilities.workspace.configuration);
	hasWorkspaceFolderCapability = !!(clientCapabilities.workspace && clientCapabilities.workspace.workspaceFolders);
	hasDiagnosticRelatedInformationCapability = !!(clientCapabilities.textDocument && clientCapabilities.textDocument.publishDiagnostics && clientCapabilities.textDocument.publishDiagnostics.relatedInformation);
}

export function changeConfig(change: DidChangeConfigurationParams) {
	if (!hasWorkspaceConfigCapability) {
		globalSettings = <PureBasicSettings>(change.settings.purebasicLanguage || defaultSettings);
	} else {
		// Reset all cached document settings
		documentSettings.clear();
	}
}

export function getDocumentSettings(doc: TextDocument): Thenable<PureBasicSettings> {
	if (!hasWorkspaceConfigCapability) {
		return Promise.resolve(globalSettings);
	}
	let docSettings = documentSettings.get(doc.uri);
	if (!docSettings) {
		docSettings = pb.connection.workspace.getConfiguration({
			scopeUri: doc.uri,
			section: 'purebasicLanguage'
		});
		documentSettings.set(doc.uri, docSettings);
	}
	return docSettings;
}

export function deleteDocumentSettings(doc: TextDocument) {
	documentSettings.delete(doc.uri);
}