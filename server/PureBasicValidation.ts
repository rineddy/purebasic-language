import {
	Diagnostic,
	DiagnosticSeverity,
	TextDocument
} from 'vscode-languageserver';

import { pb } from './PureBasicAPI';

export class PureBasicValidation {
	/**
	 * Detects any anomalies in source code
	 * @param doc
	 */
	public async validate(doc: TextDocument): Promise<void> {
		// In this simple example we get the settings for every validate run.
		let settings = await pb.settings.load(doc);

		// The validator creates diagnostics for all uppercase words length 2 and more
		let text = doc.getText();
		let pattern = /\b[A-Z]{2,}\b/g;
		let m: RegExpExecArray | null;

		let problems = 0;
		let diagnostics: Diagnostic[] = [];
		while ((m = pattern.exec(text)) && problems < settings.diagnostics.maxNumberOfProblems) {
			problems++;
			let diagnosic: Diagnostic = {
				severity: DiagnosticSeverity.Warning,
				range: {
					start: doc.positionAt(m.index),
					end: doc.positionAt(m.index + m[0].length)
				},
				message: `${m[0]} is all uppercase.`,
				source: 'ex'
			};
			if (pb.settings.hasDiagnosticRelatedInformationCapability) {
				diagnosic.relatedInformation = [
					{
						location: {
							uri: doc.uri,
							range: Object.assign({}, diagnosic.range)
						},
						message: 'Spelling matters'
					},
					{
						location: {
							uri: doc.uri,
							range: Object.assign({}, diagnosic.range)
						},
						message: 'Particularly for names'
					}
				];
			}
			diagnostics.push(diagnosic);
		}

		// Send the computed diagnostics to VSCode.
		pb.connection.sendDiagnostics({ uri: doc.uri, diagnostics });
	}
}
