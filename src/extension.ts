import * as vscode from 'vscode';

import dotenv from 'dotenv';
import path from 'path';

import { identifyLanguage, handlePythonParsing, applyChangesToEditor } from './utils/index.js';
import { getContext } from './context-analysis/index.js';
import { structurePrompt, callLLM } from './llm-integration/index.js';
import { getWebviewContent } from './views/webView.js';

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
		
		const selectedCode = editor?.document.getText(editor.selection);
		const startline = editor.selection.start.line;
		if(!selectedCode) {
			vscode.window.showErrorMessage("No Code Selected!");
			return;
		}

		const panel = vscode.window.createWebviewPanel(
			"Explain Code - NeuroCode",
			`Code Explanation`,
			vscode.ViewColumn.One,
			{ enableScripts: true , retainContextWhenHidden: true}
		);

		panel.webview.html = getWebviewContent();
		
		switch (lang) {
			case "Python":
				const structuredCode = await handlePythonParsing(context, selectedCode, startline);
				console.log(structuredCode);
				const projectContext = await getContext();
				const prompt = structurePrompt("explain", lang, structuredCode, projectContext);
				
				const response = await callLLM(prompt, panel);
				break;
			default:
				vscode.window.showInformationMessage("Unsupported Language");
		}
		
		vscode.window.showInformationMessage("Explain Code Snippet");
	});

	//Custom Prompt Command
	const customPrompt = vscode.commands.registerCommand('neurocode.customPrompt', async() => {
		const lang = identifyLanguage();

		const editor = vscode.window.activeTextEditor;
		if(!editor) {
			vscode.window.showErrorMessage("No Active Editor!");
			return;
		}

		const position = editor.selection.active;
		const currentLine = position.line;

		const selectedCode = editor?.document.getText(editor.selection);
		const startline = editor.selection.start.line;
		const endline = editor.selection.end.line;

		const userPrompt = await vscode.window.showInputBox({
			prompt: "Give Custom Prompts - NeuroCode",
			placeHolder: "Write some good code",	
			ignoreFocusOut: true
		});

		if(!userPrompt) {
			vscode.window.showWarningMessage("No Input Given By User!");
			return;
		}
		  
		switch (lang) {
			case "Python":
				const structuredCode = await handlePythonParsing(context, selectedCode, startline);
				console.log(structuredCode);
				const projectContext = await getContext();
				const prompt = structurePrompt("customPrompt", lang, structuredCode ? structuredCode : undefined, projectContext, userPrompt);

				vscode.window.showInformationMessage(`${structuredCode}`);
				
				const response = await callLLM(prompt);
				if(!response) {
					return;
				}

				console.log(response);

				if (!structuredCode) {
					applyChangesToEditor(editor,"insert", currentLine, response.endLine + 1 + currentLine, response.modifiedCode);
					return;
				}

				applyChangesToEditor(editor, "replace", response.startLine, endline + 1, response.modifiedCode);
				break;
			default:
				vscode.window.showInformationMessage("Unsupported Language");
		}
	}); 

	// Refactor Code Command
	const refactor = vscode.commands.registerCommand('neurocode.refactor', async() => {
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
				const structuredCode = await handlePythonParsing(context, code);
				break;
			default: 
				vscode.window.showInformationMessage("Unsupported Language");
		}

		vscode.window.showInformationMessage("Refactor Code Snippet");
	});

	// GenerateDoc Command
	const generateDoc = vscode.commands.registerCommand('neurocode.generateDoc', async() => {
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
				const structuredCode = await handlePythonParsing(context, code);
				break;
			default:
				vscode.window.showInformationMessage("Unsupported Language");
		}

		vscode.window.showInformationMessage("Generate Doc");
	});

	context.subscriptions.push(explain, refactor, customPrompt, generateDoc);
};

