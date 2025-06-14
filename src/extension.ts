import * as vscode from 'vscode';

import dotenv from 'dotenv';
import path from 'path';

import { identifyLanguage, handlePythonParsing, applyChangesToEditor, applyLineDecorations, clearAllDecorations, getDiffLines, addLoader, cancellableMessage } from './utils/index.js';
import { getContext } from './context-analysis/index.js';
import { structurePrompt, callLLM } from './llm-integration/index.js';
import { registerChatWebview } from './views/chatView.js';
import { getWebviewContent } from './views/webView.js';

dotenv.config({path: path.resolve(__dirname, '..', '.env')});

export async function activate(context: vscode.ExtensionContext) {
	console.log("NeuroCode is Activated");

	vscode.commands.executeCommand('neurocode.pairProgramming');

	const pairProgramming = vscode.commands.registerCommand('neurocode.pairProgramming', async() => {
		vscode.commands.executeCommand('workbench.view.explorer');
		vscode.commands.executeCommand('neurocode.chatView.focus'); 
		registerChatWebview(context);
	});

	// Explain Code Command
	const explain = vscode.commands.registerCommand('neurocode.explain', async() => {
		let structuredCode: string | undefined = "";
		const lang = identifyLanguage();
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("No Active Editor!");
			return;
		}
		
		const selectedCode = editor.document.getText(editor.selection);
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
				structuredCode = await handlePythonParsing(context, selectedCode, startline);
				break;
			default:
				vscode.window.showInformationMessage("Unsupported Language");
				return;
		}
				
		const projectContext = await getContext();
		const prompt = structurePrompt("explain", lang, structuredCode, projectContext);
		const response = await callLLM(prompt, panel);

	});

	//Custom Prompt Command
	const customPrompt = vscode.commands.registerCommand('neurocode.customPrompt', async() => {
		const lang = identifyLanguage();
		let structuredCode: string | undefined = "";

		const editor = vscode.window.activeTextEditor;
		if(!editor) {
			vscode.window.showErrorMessage("No Active Editor!");
			return;
		}

		const document = editor.document;
		const documentLineCount = document.lineCount;
		  
		let startline = editor.selection.start.line;
		let endline = editor.selection.end.line;
		
		const selectedCode = editor?.document.getText(editor.selection);
		if (!selectedCode || selectedCode.trim() === "") {
			startline = endline = editor.selection.active.line;
		}
		
		const userPrompt = await vscode.window.showInputBox({
			prompt: "Give Custom Prompts - NeuroCode",
			placeHolder: "Eg: Write a function that generates fibonacci series till n",	
			ignoreFocusOut: true
		});

		if(!userPrompt) {
			vscode.window.showWarningMessage("No Input Given By User!");
			return;
		}
		  
		switch (lang) {
			case "Python":
				structuredCode = await handlePythonParsing(context, selectedCode, startline);
				break;
			default:
				vscode.window.showInformationMessage("Unsupported Language");
				return;
		}
		
		const projectContext = await getContext();
		const prompt = structurePrompt("customPrompt", lang, structuredCode ? structuredCode : undefined, projectContext, userPrompt);

		const response = await callLLM(prompt);
		if(!response) {
			return;
		}

		if (documentLineCount === 0) {
			applyChangesToEditor(editor, "insert", 0, 0, response.modifiedCode);
			return;
		}

		if (!structuredCode) {
			const insertLine = Math.min(startline, documentLineCount);
			applyChangesToEditor(editor, "insert", insertLine, insertLine, response.modifiedCode);
			return;
		}

		const safeEndLine = Math.min(endline + 1, documentLineCount);
		applyChangesToEditor(editor, "replace", startline, safeEndLine, response.modifiedCode);
		return;
	}); 

	// Refactor Code Command
	const refactor = vscode.commands.registerCommand('neurocode.refactor', async () => {
		const lang = identifyLanguage();
		let structuredCode: string | undefined = "";

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("No Active Editor!");
			return;
		}
	
		const selection = editor.selection;
		const selectedCode = editor.document.getText(selection);

		const startLine = selection.start.line;
		const endLine = selection.end.line;
	
		if (!selectedCode) {
			vscode.window.showErrorMessage("No Code Selected!");
			return;
		}
		
		switch(lang) {
			case "Python":
				structuredCode = await handlePythonParsing(context, selectedCode);
				break;
			default:
				vscode.window.showErrorMessage("Unsupported Language!");
				return;
		}
				
		const loader = addLoader("Refactoring");
		editor.setDecorations(loader, [
			new vscode.Range(startLine, 0, endLine + 1, 0)
		]);
				
		const projectContext = await getContext();
		const prompt = structurePrompt("refactor", lang, structuredCode || undefined, projectContext);

		const llmCall = callLLM(prompt);
		const cancelMessage = cancellableMessage("Refactoring");

		let response;
		
		try {
			response = await Promise.race([llmCall, cancelMessage]);
		} catch (error) {
			editor.setDecorations(loader, []);
			vscode.window.showErrorMessage("Refactoring Cancelled/Failed!");
			return;
		}
		editor.setDecorations(loader, []);
		
		if (!response?.modifiedCode) {
			vscode.window.showInformationMessage("No Changes Detected.");
			editor.setDecorations(loader, []);
			return;
		}

		await editor.edit(editBuilder => {
			editBuilder.replace(selection, response.modifiedCode);
		});
	
		const diffLines = getDiffLines(selectedCode, response.modifiedCode, startLine);
		applyLineDecorations(editor, diffLines);
	
		const options: vscode.QuickPickItem[] = [
			{ label: '✅ Accept', description: 'Apply the refactored code' },
			{ label: '❌ Reject', description: 'Revert to the original code' }
		];
	
		const choice = await vscode.window.showQuickPick(options, {
			placeHolder: 'What do you want to do with the refactored code?'
		});
	
		const modifiedLineCount = response.modifiedCode.split('\n').length;
		const revertRange = new vscode.Range(startLine, 0, startLine + modifiedLineCount, 0);

		if (!choice) {
			vscode.window.showInformationMessage('No selection made.');
			await editor.edit(editBuilder => {
				editBuilder.replace(revertRange, selectedCode);
			});
			clearAllDecorations(editor);
			return;
		}
	
		switch (choice.label) {
			case '✅ Accept':
				clearAllDecorations(editor);
				vscode.window.showInformationMessage('Changes accepted!');
				return;
			case '❌ Reject':
				await editor.edit(editBuilder => {
					editBuilder.replace(revertRange, selectedCode);
				});
				clearAllDecorations(editor);
				vscode.window.showInformationMessage('Changes reverted!');
				return;
		}
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

	context.subscriptions.push(explain, refactor, customPrompt, generateDoc, pairProgramming);
};

