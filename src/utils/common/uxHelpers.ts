import * as vscode from 'vscode';

function getDiffLines(original: string, modified: string, baseLine: number) {
	const originalLines = original.split('\n');
	const modifiedLines = modified.split('\n');

	const added: vscode.Range[] = [];
	const removed: vscode.Range[] = [];
	const changed: vscode.Range[] = [];

	const maxLen = Math.max(originalLines.length, modifiedLines.length);

	for (let i = 0; i < maxLen; i++) {
		const orig = originalLines[i];
		const mod = modifiedLines[i];

		if (orig === undefined && mod !== undefined) {
			added.push(new vscode.Range(baseLine + i, 0, baseLine + i, mod.length));
		} else if (mod === undefined && orig !== undefined) {
			removed.push(new vscode.Range(baseLine + i, 0, baseLine + i, orig.length));
		} else if (orig !== mod) {
			changed.push(new vscode.Range(baseLine + i, 0, baseLine + i, Math.max(orig.length, mod.length)));
		}
	}

	return { added, removed, changed };
}

const addedDecoration = vscode.window.createTextEditorDecorationType({
	backgroundColor: 'rgba(0, 255, 0, 0.1)', // Green
	isWholeLine: true
});

const removedDecoration = vscode.window.createTextEditorDecorationType({
	backgroundColor: 'rgba(255, 0, 0, 0.1)', // Red
	isWholeLine: true
});

const modifiedDecoration = vscode.window.createTextEditorDecorationType({
	backgroundColor: 'rgba(255, 255, 0, 0.1)', // Yellow
	isWholeLine: true
});

function applyLineDecorations(
	editor: vscode.TextEditor,
	lines: { added: vscode.Range[]; removed: vscode.Range[]; changed: vscode.Range[] }
) {
	editor.setDecorations(addedDecoration, lines.added);
	editor.setDecorations(removedDecoration, lines.removed);
	editor.setDecorations(modifiedDecoration, lines.changed);
}

function clearAllDecorations(editor: vscode.TextEditor) {
	editor.setDecorations(addedDecoration, []);
	editor.setDecorations(removedDecoration, []);
	editor.setDecorations(modifiedDecoration, []);
}

function addLoader(message: string) {
	const loadingDecorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: 'rgba(128, 128, 128, 0.1)',
		isWholeLine: true,
		after: {
			contentText: `⏳ ${message}... (click Cancel above to abort)`,
			color: 'gray',
			margin: '0 0 0 1rem',
		},
	});

	return loadingDecorationType;
}

function cancellableMessage(message: string) {
	const controller = new AbortController();
	
	return new Promise<never>((_, reject) => {
		vscode.window
			.showInformationMessage(`${message} in progress...`, "Cancel")
			.then(selection => {
				if (selection === "Cancel") {
					controller.abort();
					reject(new Error("User cancelled"));
				}
			});
	});
};


export { getDiffLines, applyLineDecorations, clearAllDecorations, addLoader, cancellableMessage };