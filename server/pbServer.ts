/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {
	CompletionItem,
	CompletionItemKind,
	Diagnostic,
	DiagnosticSeverity,
	DidChangeConfigurationNotification,
	DocumentFormattingParams,
	InitializeParams,
	Position,
	ProposedFeatures,
	TextDocument,
	TextDocumentPositionParams,
	TextDocuments,
	TextEdit,
	createConnection,
} from 'vscode-languageserver';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();

let hasConfigurationCapability: boolean | undefined = false;
let hasWorkspaceFolderCapability: boolean | undefined = false;
let hasDiagnosticRelatedInformationCapability: boolean | undefined = false;

connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we will fall back using global settings
	hasConfigurationCapability = capabilities.workspace && !!capabilities.workspace.configuration;
	hasWorkspaceFolderCapability = capabilities.workspace && !!capabilities.workspace.workspaceFolders;
	hasDiagnosticRelatedInformationCapability = capabilities.textDocument && capabilities.textDocument.publishDiagnostics && capabilities.textDocument.publishDiagnostics.relatedInformation;

	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			documentRangeFormattingProvider: true,			// Tell the client that the server supports formatting
			documentFormattingProvider: true, 				// Tell the client that the server supports formatting
			documentOnTypeFormattingProvider: {				// Tell the client that the server supports formatting
				firstTriggerCharacter: ':',
				moreTriggerCharacter: ['(', '[', '{']
			},
			completionProvider: { resolveProvider: true } 	// Tell the client that the server supports code completion
		}
	};
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

// Purebasic custom settings
interface PureBasicSettings {
	maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: PureBasicSettings = { maxNumberOfProblems: 1000 };
let globalSettings: PureBasicSettings = defaultSettings;

// Cache the settings of all open documents
let documentSettings: Map<string, Thenable<PureBasicSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <PureBasicSettings>(
			(change.settings.purebasicLanguage || defaultSettings)
		);
	}

	// Revalidate all open text documents
	documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<PureBasicSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'purebasicLanguage'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	// In this simple example we get the settings for every validate run.
	let settings = await getDocumentSettings(textDocument.uri);

	// The validator creates diagnostics for all uppercase words length 2 and more
	let text = textDocument.getText();
	let pattern = /\b[A-Z]{2,}\b/g;
	let m: RegExpExecArray | null;

	let problems = 0;
	let diagnostics: Diagnostic[] = [];
	while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
		problems++;
		let diagnosic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length)
			},
			message: `${m[0]} is all uppercase.`,
			source: 'ex'
		};
		if (hasDiagnosticRelatedInformationCapability) {
			diagnosic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Spelling matters'
				},
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Particularly for names'
				}
			];
		}
		diagnostics.push(diagnosic);
	}

	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.
		return [
			{
				label: 'Procedure',
				kind: CompletionItemKind.Keyword,
				data: 1
			},
			{
				label: 'EndProcedure',
				kind: CompletionItemKind.Keyword,
				data: 2
			}
		];
	}
);

connection.onDocumentFormatting(
	(docFormattingParams: DocumentFormattingParams): TextEdit[] => {
		docFormattingParams.options.insertSpaces;
		return [
			TextEdit.insert(Position.create(0, 3), 'xx1'),
		];
	}
);

connection.onDocumentRangeFormatting(
	(docFormattingParams: DocumentFormattingParams): TextEdit[] => {
		docFormattingParams.options.insertSpaces;
		return [
			TextEdit.insert(Position.create(0, 3), 'xxx2'),
		];
	}
);

connection.onDocumentOnTypeFormatting(
	(docFormattingParams: DocumentFormattingParams): TextEdit[] => {
		docFormattingParams.options.insertSpaces;
		return [
			TextEdit.insert(Position.create(0, 3), 'xxx3'),
		];
	}
);

// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		if (item.data === 2) {
			(item.detail = 'EndProcedure details'),
				(item.documentation = 'EndProcedure documentation');
		} else if (item.data === 1) {
			(item.detail = 'Procedure details'),
				(item.documentation = 'Procedure documentation');
		}
		return item;
	}
);

/*
connection.onDidOpenTextDocument((params) => {
	// A text document got opened in VSCode.
	// params.uri uniquely identifies the document. For documents store on disk this is a file URI.
	// params.text the initial full content of the document.
	connection.console.log(`${params.textDocument.uri} opened.`);
});
connection.onDidChangeTextDocument((params) => {
	// The content of a text document did change in VSCode.
	// params.uri uniquely identifies the document.
	// params.contentChanges describe the content changes to the document.
	connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
connection.onDidCloseTextDocument((params) => {
	// A text document got closed in VSCode.
	// params.uri uniquely identifies the document.
	connection.console.log(`${params.textDocument.uri} closed.`);
});
*/

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
