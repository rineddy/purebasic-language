export namespace pbText {
	export function removeLineBreak(txt: string): string {
		return txt.replace(/[\r\n]+/, '');
	}
	export function splitBySpacingOrStringOrComment(txt: string): string[] {
		return txt.split(/(^\s+|".+?"|'.+?'|["';].*)/g).filter(part => part !== '');
	}
	export function startsWithSpacing(txt: string): boolean {
		return txt.match(/^\s/) !== null;
	}
	export function startsWithStringOrComment(txt: string): boolean {
		return txt.match(/^["';]/) !== null;
	}
	export function addExtensions(txt: string, prefix: string, suffix: string) {
		return (!prefix && !suffix) ? txt : prefix + txt + suffix;
	}
	export function removeExtensions(txt: string, prefix: string, suffix: string) {
		return (!prefix && !suffix) ? txt : txt.substr(prefix.length, txt.length - suffix.length - prefix.length);
	}
}
