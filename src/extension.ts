import * as vscode from 'vscode';

import { identifyLanguage } from './utils/index.js';

export function activate(context: vscode.ExtensionContext) {
	console.log("NeuroCode is Activated");

	const explain = vscode.commands.registerCommand('neurocode.explain', () => {
		const lang = identifyLanguage();

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

