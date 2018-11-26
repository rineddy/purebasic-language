import {
	FormattingOptions,
	TextDocument
} from 'vscode-languageserver';
import { ICustomIndentation, ICustomLineStruct, pb } from './PureBasicAPI';

export class PureBasicIndentation {
	/**
	 * create indentation
	 * @param doc
	 * @param options
	 */
	public async create(doc: TextDocument, options: FormattingOptions): Promise<ICustomIndentation> {
		const settings = await pb.settings.load(doc);
		const indentation = <ICustomIndentation>{
			current: 0,
			next: 0,
			options: options,
			settings: settings
		};
		return Promise.resolve(indentation);
	}
	/**
	 * Update line indents according to words and indentation context
	 */
	public update(lineStruct: ICustomLineStruct, ind: ICustomIndentation) {
		const { settings, options } = ind;
		let isCurrentIdentation = true;
		ind.current = ind.next;
		lineStruct.words.forEach(word => {
			const indentRule = settings.indentationRules.find(indentRule => word.match(indentRule.regex) != null);
			if (indentRule) {
				if (isCurrentIdentation) {
					if (indentRule.before) {
						ind.current += indentRule.before;
						if (ind.current < 0) ind.current = 0;
						ind.next = ind.current;
					}
					if (indentRule.after) {
						ind.next += indentRule.after;
						isCurrentIdentation = false;
					}
				}
				else {
					ind.next += indentRule.before + indentRule.after;
				}
			}
		});
		lineStruct.indents = (options.insertSpaces ? '\t' : ' '.repeat(options.tabSize)).repeat(ind.current);
	}

}