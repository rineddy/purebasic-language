import {
	FormattingOptions,
	TextDocument
} from 'vscode-languageserver';
import { ICustomIndentation, ICustomLineStruct, pb } from './PureBasicAPI';

import { settings } from 'cluster';

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
			settings: settings
		};
		return Promise.resolve(indentation);
	}
	/**
	 * Update line indents according to words and indentation context
	 */
	public update(lineStruct: ICustomLineStruct, currentIndentation: ICustomIndentation) {
		const { settings, options } = currentIndentation;
		let isCurrentIdentation = true;
		lineStruct.words.forEach(word => {
			const indentRule = settings.indentationRules.find(indentRule => word.match(indentRule.regex) != null);
			if (indentRule) {
				if (isCurrentIdentation) {
				}
				else {
				}
			}
		});
		currentIndentation.current = lineStruct.indents;
	}

}