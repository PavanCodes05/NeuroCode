import * as vscode from 'vscode';

import dotenv from 'dotenv';
import path from 'path';

import { identifyLanguage, handlePythonParsing } from './utils/index.js';
import { getContext } from './context-analysis/index.js';
import { structurePrompt, callLLM } from './llm-integration/index.js';

dotenv.config({path: path.resolve(__dirname, '..', '.env')});

export async function activate(context: vscode.ExtensionContext) {
	console.log("NeuroCode is Activated");

	// Explain Code Command
	const explain = vscode.commands.registerCommand('neurocode.explain', async() => {
		const lang = identifyLanguage();

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("No Active Editor!");
			return;
		}

		const code = editor?.document.getText(editor.selection);
		if(!code) {
			vscode.window.showErrorMessage("No Code Selected!");
			return;
		}
		
		switch (lang) {
			case "Python":
				const structuredCode = await handlePythonParsing(context, code);
				const projectContext = await getContext();
				const prompt = structurePrompt("explain", lang, structuredCode, projectContext);
				
				const response = await callLLM(prompt);
				console.log(response);
				break;
			default:
				vscode.window.showInformationMessage("Unsupported Language");
		}
		
		vscode.window.showInformationMessage("Explain Code Snippet");
	});

	// Refactor Code Command
	const refactor = vscode.commands.registerCommand('neurocode.refactor', async() => {
		let structuredCode: string = "";

		const lang = identifyLanguage();

		const editor = vscode.window.activeTextEditor;
		if(!editor) {
			vscode.window.showErrorMessage("No Active Editor!");
			return;
		}
		
		const code = editor?.document.getText(editor.selection);
		if(!code) {
			vscode.window.showErrorMessage("No Code Selected!");
			return;
		}

		switch(lang) {
			case "Python":
				structuredCode = await handlePythonParsing(context, code);
				break;
			default: 
				vscode.window.showInformationMessage("Unsupported Language");
		}

		vscode.window.showInformationMessage("Refactor Code Snippet");
	});

	// GenerateDoc Command
	const generateDoc = vscode.commands.registerCommand('neurocode.generateDoc', async() => {
		let structuredCode: string = "";
		const lang = identifyLanguage();

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("No Active Editor!");
			return;
		}

		const code = editor?.document.getText();
		if (!code) {
			vscode.window.showErrorMessage("Document is empty!");
			return;
		}

		switch(lang) {
			case "Python":
				structuredCode = await handlePythonParsing(context, code);
				break;
			default:
				vscode.window.showInformationMessage("Unsupported Language");
		}

		vscode.window.showInformationMessage("Generate Doc");
	});

	context.subscriptions.push(explain, refactor, generateDoc);
};

