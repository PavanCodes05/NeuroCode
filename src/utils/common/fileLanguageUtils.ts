import * as path from 'path';
import * as vscode from 'vscode';

const langMap: Record<string, string> = {
    '.py': 'Python',
    '.ts': 'Typescript',
    '.java': "Java",
    '.cpp': "C++",
    '.go': "Go"
};

const extensionToLanguage = (ext: string): string | undefined => {
    return langMap[ext];
};


const identifyLanguage = (): string | undefined => {
    const editor = vscode.window.activeTextEditor;

    if(!editor) {
        vscode.window.showInformationMessage("No active editor!");
        return;  
    }

    const fileUri = editor.document.uri;
    const filePath = fileUri.fsPath;
    const extension = path.extname(filePath);
    
    return extensionToLanguage(extension);
};

export { identifyLanguage };