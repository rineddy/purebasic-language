import * as vscode from 'vscode';

/** Technical interface of vs code configuration */
export interface AdvancedWorkspaceConfiguration {
    get<T>(section: string, defaultValue?: T): T;
    has(section: string): boolean;
    [key: string]: any;
    inspect<T>(section: string): { defaultValue: T, globalValue: T, key: string, workspaceValue: T } | undefined;
    update(section: string, value: any, global?: boolean): Thenable<void>;
}

/** Get configuration of vs code. */
export const getConfig = (section?: string) => {
    return vscode.workspace.getConfiguration(section) as AdvancedWorkspaceConfiguration;
};

/** Update configuration of vs code. */
export const setConfig = (section: string, value: any, global: boolean = false) => {
    return getConfig().update(section, value, global);
};

/**
 * Get name of active icon theme
 */
export const getIconThemeName = (): string | undefined => {
    let iconTheme = getConfig().inspect('workbench.iconTheme');
    return iconTheme !== undefined ? (String)(iconTheme.workspaceValue || iconTheme.globalValue || iconTheme.defaultValue) : undefined;
};

/** Add PureBasic icon file. */
export const setPureBasicIcon = (enabled: boolean = true) => {
    let iconThemeName = getIconThemeName();
    console.log(`Current icon theme: ${iconThemeName}`);

    // getConfig('material-icon-theme').update(section, value, global)

    vscode.env;
    vscode.extensions;
    vscode.scm;
    vscode.tasks;
    vscode.languages;
    vscode.commands;
    vscode.workspace;
    vscode.window;

    console.log('The purebasic icon is now active!');
    // return getConfig().update(section, value, global);
};


