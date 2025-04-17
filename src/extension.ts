import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log("NeuroCode is Activated");

	const explain = vscode.commands.registerCommand('neurocode.explain', () => {
		vscode.window.showInformationMessage("Explain Code Snippet");
	});

	const refactor = vscode.commands.registerCommand('neurocode.refactor', () => {
		vscode.window.showInformationMessage("Refactor Code Snippet");
	});

	const generateDoc = vscode.commands.registerCommand('neurocode.generateDoc', () => {
		vscode.window.showInformationMessage("Generate Doc");
	});

	context.subscriptions.push(explain, refactor, generateDoc);
};

