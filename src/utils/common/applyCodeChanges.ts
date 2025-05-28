import * as vscode from 'vscode';

function applyChangesToEditor(editor: vscode.TextEditor, type: string, startLine: number, endLine: number, newCode: string) {
  const document = editor.document;
  const lineCount = document.lineCount;

  const isEmptyDocument = lineCount <= 1 && document.getText().trim() === '';
  
  if (isEmptyDocument) {
    console.log(`DEBUG: Empty/single line document, replacing all content`);
    editor.edit(editBuilder => {
      const fullRange = new vscode.Range(
        new vscode.Position(0, 0),
        new vscode.Position(Math.max(0, lineCount - 1), document.lineAt(Math.max(0, lineCount - 1)).text.length)
      );
      editBuilder.replace(fullRange, newCode);
    }).then(success => {
      console.log(`DEBUG: Empty document edit success: ${success}`);
    });
    return;
  }

  const safeStartLine = Math.min(Math.max(startLine, 0), lineCount - 1);
  const safeEndLine = Math.min(Math.max(endLine, safeStartLine), lineCount);

  if (safeStartLine < 0) {
    vscode.window.showWarningMessage("Invalid line range, skipping edit.");
    return;
  }

  editor.edit(editBuilder => {
      switch (type) {
          case "replace":
            if (safeEndLine > safeStartLine) {
              const replaceStart = new vscode.Position(safeStartLine, 0);
              const replaceEnd = new vscode.Position(safeEndLine, 0);
              const replaceRange = new vscode.Range(replaceStart, replaceEnd);
              editBuilder.replace(replaceRange, newCode);
            } else {
              const insertPos = new vscode.Position(safeStartLine, 0);
              editBuilder.insert(insertPos, newCode);
            }
            break;
          case "insert":
              const insertPos = new vscode.Position(safeStartLine, 0);
              editBuilder.insert(insertPos, newCode);
              break;
      }
  });
}



export { applyChangesToEditor };