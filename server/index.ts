import {
	DidChangeConfigurationNotification,
	DidChangeTextDocumentNotification,
	DocumentFormattingRequest,
	DocumentRangeFormattingRequest,
	InitializeParams,
	TextDocument,
	TextDocumentChangeRegistrationOptions,
	TextDocumentRegistrationOptions,
	TextDocumentSyncKind,
} from 'vscode-languageserver';

import { pb } from './PureBasicAPI';

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';



pb.connection.onInitialize((params: InitializeParams) => {
	pb.settings.initialize(params);
	return {
		capabilities: {
			textDocumentSync: pb.documents.syncKind,
			// definitionProvider: true,
			// typeDefinitionProvider: undefined,
			// codeActionProvider: true,
			// codeLensProvider: undefined,
			// documentLinkProvider: undefined,
			// documentHighlightProvider: true,
			// documentSymbolProvider: true,
			documentRangeFormattingProvider: true,			// Tell the client that the server supports formatting
			documentFormattingProvider: true, 				// Tell the client that the server supports formatting
			documentOnTypeFormattingProvider: {				// Tell the client that the server supports formatting
				firstTriggerCharacter: ':'                  // ,moreTriggerCharacter: ['(', '[', '{']
			},
			completionProvider: { resolveProvider: true }, 	// Tell the client that the server supports code completion
			// colorProvider: undefined,
			// referencesProvider: undefined,
			// signatureHelpProvider: undefined,
			// executeCommandProvider: undefined,
			// hoverProvider: undefined,
			// renameProvider: undefined,
			// workspaceSymbolProvider: undefined
		}
	};
});

pb.connection.onInitialized(() => {
	// Register for incremental text changes
	pb.connection.client.register(DidChangeTextDocumentNotification.type, <TextDocumentChangeRegistrationOptions>{
		syncKind: TextDocumentSyncKind.Full
	});
	pb.connection.client.register(DocumentRangeFormattingRequest.type, <TextDocumentRegistrationOptions>{});
	pb.connection.client.register(DocumentFormattingRequest.type, <TextDocumentRegistrationOptions>{});

	if (pb.settings.hasWorkspaceConfigCapability) {
		// Register for all configuration changes.
		pb.connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (pb.settings.hasWorkspaceFolderCapability) {
		pb.connection.workspace.onDidChangeWorkspaceFolders(_event => {
			pb.connection.console.log('Workspace folder change event received.');
		});
	}
});

pb.connection.onDidChangeConfiguration(change => {
	pb.settings.change(change);

	// Revalidate all open text pb.documents
	pb.documents.all().forEach(pb.validator.validate);
});
// Make the text document manager listen on the pb.connection
// for open, change and close text document events
pb.documents.listen(pb.connection);

// Only keep settings for open pb.documents
pb.documents.onDidClose(e => {
	pb.indentator.remove(e.document);
	pb.settings.remove(e.document);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
pb.documents.onDidChangeContent(change => {
	pb.validator.validate(change.document);
});

pb.documents.onDidOpen(async change => {
	await pb.indentator.load(change.document);
});

pb.connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	pb.connection.console.log('We received an file change event');
});

pb.connection.onCompletion(pb.completion.getCompletionItems);
pb.connection.onCompletionResolve(pb.completion.getCompletionDescription);

pb.connection.onDocumentFormatting(pb.formatter.formatAll);
pb.connection.onDocumentRangeFormatting(pb.formatter.formatRange);
pb.connection.onDocumentOnTypeFormatting(pb.formatter.formatOnType);

pb.connection.onDidChangeTextDocument((params) => {
	// The content of a text document did change in VSCode.
	// params.uri uniquely identifies the document.
	// params.contentChanges describe the content changes to the document.

	pb.connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
/**
pb.connection.onDidOpenTextDocument((params) => {
	// A text document got opened in VSCode.
	// params.uri uniquely identifies the document. For pb.documents store on disk this is a file URI.
	// params.text the initial full content of the document.
	pb.connection.console.log(`${params.textDocument.uri} opened.`);
});
pb.connection.onDidCloseTextDocument((params) => {
	// A text document got closed in VSCode.
	// params.uri uniquely identifies the document.
	pb.connection.console.log(`${params.textDocument.uri} closed.`);
});
/**/

// Listen on the pb.connection
pb.connection.listen();

