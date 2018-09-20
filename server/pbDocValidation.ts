import {
	Diagnostic,
	DiagnosticSeverity,
	TextDocument
} from 'vscode-languageserver';

import pb from './pbAPI';

export class PureBasicDocValidation {
	/**
	 * Detects any anomalies in source code
	 * @param textDocument
	 */
	public validateDocument = async (textDocument: TextDocument): Promise<void> => {
		// In this simple example we get the settings for every validate run.
		let settings = await pb.settings.getDocumentSettings(textDocument);

		// The validator creates diagnostics for all uppercase words length 2 and more
		let text = textDocument.getText();
		let pattern = /\b[A-Z]{2,}\b/g;
		let m: RegExpExecArray | null;

		let problems = 0;
		let diagnostics: Diagnostic[] = [];
		while ((m = pattern.exec(text)) && problems < settings.diagnostics.maxNumberOfProblems) {
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
			if (pb.settings.hasDiagnosticRelatedInformationCapability) {
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
		pb.connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
	}
}

