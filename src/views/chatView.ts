import * as vscode from 'vscode';
import { getChatHtml } from './getChatHtml';

export function registerChatWebview(context: vscode.ExtensionContext) {
	console.log("🐾 Chat view is resolving...");
	const storedPersona = context.globalState.get<string>('selectedPersona') || 'mentor';

	const provider: vscode.WebviewViewProvider = {
		resolveWebviewView(webviewView: vscode.WebviewView) {
			webviewView.webview.options = {
				enableScripts: true
			};

			console.log("🧪 Injecting webview HTML");

			webviewView.webview.html = getChatHtml(webviewView.webview, context.extensionUri, storedPersona);

			webviewView.webview.onDidReceiveMessage((message) => {
				switch (message.command) {
					case 'personaChanged':
						context.globalState.update('selectedPersona', message.persona);
						webviewView.webview.html = getChatHtml(webviewView.webview, context.extensionUri, message.persona);
						break;
				}
			});
		}
	};

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("neurocode.chatView", provider)
	);
}
