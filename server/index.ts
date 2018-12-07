import {
	DidChangeConfigurationNotification,
	InitializeParams,
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
			textDocumentSync: TextDocumentSyncKind.Full,
			completionProvider: { resolveProvider: true }, 	// Tell the client that the server supports code completion
			documentRangeFormattingProvider: true,			// Tell the client that the server supports formatting
			documentFormattingProvider: true, 				// Tell the client that the server supports formatting
			documentOnTypeFormattingProvider: {				// Tell the client that the server supports formatting
				firstTriggerCharacter: ':'
				, moreTriggerCharacter: ['\n', '(', '[', '{']
			},
			// definitionProvider: true,
			// typeDefinitionProvider: undefined,
			// codeActionProvider: true,
			// codeLensProvider: undefined,
			// documentLinkProvider: undefined,
			// documentHighlightProvider: true,
			// documentSymbolProvider: true,
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

pb.documentation.onDidOpen(async () => {
});
// Only keep settings for open pb.documents
pb.documentation.onDidClose(e => {
	pb.settings.remove(e.document);
});
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
pb.documentation.onDidChangeContent(change => {
	pb.validation.validate(change.document);
});

pb.connection.onDidChangeConfiguration(changes => {
	pb.settings.change(changes);
	// Revalidate all open text pb.documents
	pb.documentation.all().forEach(pb.validation.validate);
});
pb.connection.onDidChangeWatchedFiles(() => {
	// Monitored files have change in VSCode
	pb.connection.console.log('We received an file change event');
});
pb.connection.onCompletion(pb.completion.getCompletionItems);
pb.connection.onCompletionResolve(pb.completion.getCompletionDescription);
pb.connection.onDocumentFormatting(pb.formatter.formatAll);
pb.connection.onDocumentRangeFormatting(pb.formatter.formatRange);
pb.connection.onDocumentOnTypeFormatting(pb.formatter.formatOnType);

pb.connection.listen(); 				// Listen on the pb.connection
pb.documentation.listen(pb.connection); // Make the text document manager listen on the pb.connection (for open, change and close text document events)