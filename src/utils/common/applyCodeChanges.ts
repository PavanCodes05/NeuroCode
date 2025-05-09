import * as vscode from 'vscode';

function applyChangesToEditor(editor: vscode.TextEditor, type:string, startLine: number, endLine: number, newCode: string) {
      editor.edit(editBuilder => {
        switch(type) {
          case "replace":
            const replaceStart = new vscode.Position(startLine, 0);
            const replaceEnd = new vscode.Position(endLine, 0); 
            const replaceRange = new vscode.Range(replaceStart, replaceEnd);
            editBuilder.delete(replaceRange);
            editBuilder.insert(replaceStart, newCode);
            break;
          case "insert":
            const insertStart = new vscode.Position(startLine, 0);
            editBuilder.insert(insertStart, newCode);
            break;
        }

    });
};

export { applyChangesToEditor };