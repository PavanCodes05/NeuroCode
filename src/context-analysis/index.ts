import * as vscode from 'vscode';

import { getProjectStructure } from "./projectStructure";

const getContext = async() => {
    const rootUri =  vscode.workspace.workspaceFolders?.[0].uri;
    if(!rootUri) {
        return null;
    }

    try {
        const projectStructure = await getProjectStructure(rootUri);
    } catch(error) {

    };
};

export { getContext };