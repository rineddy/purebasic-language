import {
	FormattingOptions,
	TextDocument
} from 'vscode-languageserver';
import { ICustomIndentation, ICustomLineStruct } from './PureBasicData';

import { pb } from './PureBasicAPI';

export class PureBasicIndentation {
	/**
	 * create indentation
	 * @param doc
	 * @param options
	 */
	public async create(doc: TextDocument, options: FormattingOptions): Promise<ICustomIndentation> {
		const settings = await pb.settings.load(doc);
		const indentation = <ICustomIndentation>{
			current: '',
			next: '',
			options: options,
			indentRules: settings.indentation.rules
		};
		return Promise.resolve(indentation);
	}
	/**
	 * Update indentation according to `words` and `spaces` of current line
	 */
	public update(lineStruct: ICustomLineStruct, indentContext: ICustomIndentation) {
		let isCurrentIdentation = true;
		indentContext.current = lineStruct.indents;
		words.forEach(() => {
			if (isCurrentIdentation) {
			}
			else {
			}
		});
	}

	/**
	 * Remap indents of open document between start line and end line
	 */
	// private remap(doc: TextDocument, startLine: number, endLine: number, indents?: Thenable<IDocumentIndents>): Thenable<IDocumentIndents> {
	// 	if (!indents) {
	// 		indents = Promise.resolve(<IDocumentIndents>{ lineIndentations: new Map<number, number>() });
	// 	}
	// 	indents.then(res => {
	// 		for (let line = startLine; line <= endLine; line++) {
	// 			let rg: Range = Range.create(line, 0, line, Number.MAX_SAFE_INTEGER);
	// 			let text = doc.getText(rg).replace(pb.text.FINDS_STRING_OR_COMMENT, '');
	// 			let countIndents = (text.match(/\b(If|Select|Procedure)\b/gi) || []).length;
	// 			let countUnindents = (text.match(/\b(EndIf|EndSelect|EndProcedure)\b/gi) || []).length;
	// 			if ((countIndents - countUnindents) !== 0) {
	// 				res.lineIndentations.set(line, countIndents - countUnindents);
	// 			} else if (res.lineIndentations.has(line)) {
	// 				res.lineIndentations.delete(line);
	// 			}
	// 		}
	// 		return res;
	// 	});
	// 	return indents;
	// }
}