import * as vscode from 'vscode';

import { getProjectStructure } from "./projectStructure";

const getContext = async() => {
    const rootUri =  vscode.workspace.workspaceFolders?.[0].uri;
    if(!rootUri) {
        return;
    }

    try {
        const projectStructure = await getProjectStructure(rootUri);
        return projectStructure;
    } catch(error) {
        throw error;
    };
};

export { getContext };