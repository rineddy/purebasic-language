import {
	FormattingOptions,
	TextDocument
} from 'vscode-languageserver';
import { ICustomIndenting, ICustomLineStruct, pb } from './PureBasicAPI';

export class PureBasicIndentation {
	/**
	 * create indenting context
	 * @param doc
	 * @param options
	 */
	public async create(doc: TextDocument, options: FormattingOptions): Promise<ICustomIndenting> {
		const settings = await pb.settings.load(doc);
		const indentation = <ICustomIndenting>{
			current: 0,
			next: 0,
			options: options,
			settings: settings,
			oneIndent: (options.insertSpaces ? ' '.repeat(options.tabSize) : '\t'),
			tabSpaces: ' '.repeat(options.tabSize)
		};
		return Promise.resolve(indentation);
	}
	/**
	 * Update line indents according to words and indentating context
	 */
	public update(lineStruct: ICustomLineStruct, indenting: ICustomIndenting) {
		const { settings, oneIndent } = indenting;
		// reset current indents
		if (indenting.next < 0) indenting.next = 0;
		indenting.current = indenting.next;
		// calculate current and next indents
		let isIndentingCurrentLine = true;
		lineStruct.words.forEach(word => {
			const indentRule = settings.indentationRules.find(indentRule => word.match(indentRule.regex) != null);
			if (indentRule) {
				if (isIndentingCurrentLine) {
					if (indentRule.before) {
						indenting.current += indentRule.before;
						indenting.next = indenting.current;
					}
					if (indentRule.after) {
						indenting.next += indentRule.after;
						isIndentingCurrentLine = false;
					}
				}
				else {
					indenting.next += indentRule.before + indentRule.after;
				}
			}
		});
		// apply current indents on current line
		if (indenting.current < 0) indenting.current = 0;
		lineStruct.indents = oneIndent.repeat(indenting.current);
	}
	/**
	 * Pick line indents used for next indentation
	 * @returns True if line indentation is picked
	 */
	public pick(lineStruct: ICustomLineStruct, indenting: ICustomIndenting): boolean {
		const { settings, options, tabSpaces } = indenting;
		let isIndentingCurrentLine = true;
		let isIndentsPicked = false;
		indenting.next = lineStruct.indents.replace(/\t/g, tabSpaces).length / options.tabSize;
		lineStruct.words.forEach(word => {
			const indentRule = settings.indentationRules.find(indentRule => word.match(indentRule.regex) != null);
			if (indentRule) {
				isIndentsPicked = true;
				if (isIndentingCurrentLine) {
					if (indentRule.after) {
						indenting.next += indentRule.after;
						isIndentingCurrentLine = false;
					}
				}
				else {
					indenting.next += indentRule.before + indentRule.after;
				}
			}
		});
		return isIndentsPicked;
	}
}