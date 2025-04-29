import * as vscode from 'vscode';

import * as fs from 'fs/promises';
import ignore from 'ignore';

interface ProjectStructure {
    name: string,
    type: "File" | "Directory",
    children?: ProjectStructure[]
}

let ig = ignore();
let ignoreReady = false;


const loadGitIgnore = async() => {
    try {
        const rootUri = vscode.workspace.workspaceFolders?.[0].uri;
        if(rootUri === undefined) {
            vscode.window.showInformationMessage("No Current Workspace Found!");
            return;
        };

        const gitIgnoreUri = vscode.Uri.joinPath(rootUri, '.gitignore');
        const content = await fs.readFile(gitIgnoreUri.path, 'utf-8');

        ig = ignore().add(content);
        ignoreReady = true;
    } catch(err) {
        console.warn("No .gitignore file found or failed to load", err);
    }
};

const getProjectStructure = async (uri: vscode.Uri): Promise<ProjectStructure[]> => {

    if(!ignoreReady) {
        await loadGitIgnore();
    };

    const entries: [string, vscode.FileType][] = await vscode.workspace.fs.readDirectory(uri!);

    const structure: ProjectStructure[] = [];

    for (const [name, type] of entries) {
        if (ig.ignores(name)) {
            continue;
        }
        let temp: ProjectStructure = { "name": name, "type": (type === vscode.FileType.Directory) ? "Directory": "File"};

        if ( type === vscode.FileType.Directory ) {
            const children = await getProjectStructure(vscode.Uri.joinPath(uri, name));
            temp["children"] = children;
        }

        structure.push(temp);
    };

    return structure;
};


export { getProjectStructure };