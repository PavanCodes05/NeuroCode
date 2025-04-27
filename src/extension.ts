import * as vscode from 'vscode';

import { identifyLanguage, handlePythonParsing } from './utils/index.js';

export async function activate(context: vscode.ExtensionContext) {
	console.log("NeuroCode is Activated");

	const explain = vscode.commands.registerCommand('neurocode.explain', async() => {
		let structuredCode: string = "";

		const lang = identifyLanguage();

		const editor = vscode.window.activeTextEditor;
		const code = editor?.document.getText() ?? "";

		switch (lang) {
			case "Python":
				structuredCode = await handlePythonParsing(context, code);
				break;
			default:
				vscode.window.showInformationMessage("Unsupported Language");
		}
		
		vscode.window.showInformationMessage("Explain Code Snippet");
	});

	const refactor = vscode.commands.registerCommand('neurocode.refactor', () => {
		const lang = identifyLanguage();

		vscode.window.showInformationMessage("Refactor Code Snippet");
	});

	const generateDoc = vscode.commands.registerCommand('neurocode.generateDoc', () => {
		const lang = identifyLanguage();

		vscode.window.showInformationMessage("Generate Doc");
	});

	context.subscriptions.push(explain, refactor, generateDoc);
};

