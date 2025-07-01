import * as vscode from 'vscode';
import { getChatHtml } from './getChatHtml';

let currentWebview: vscode.Webview | undefined;

export function registerChatWebview(context: vscode.ExtensionContext) {
	console.log("🐾 Chat view is resolving...");
	const storedPersona = context.globalState.get<string>('selectedPersona') || 'mentor';

	const provider: vscode.WebviewViewProvider = {
		resolveWebviewView(webviewView: vscode.WebviewView) {
			console.log("🧪 Injecting webview HTML");

			currentWebview = webviewView.webview; 
			currentWebview.options = { enableScripts: true };
			currentWebview.html = getChatHtml(currentWebview, context.extensionUri, storedPersona);

			currentWebview.onDidReceiveMessage((message) => {
				switch (message.command) {
					case 'personaChanged':
						context.globalState.update('selectedPersona', message.persona);
						currentWebview!.html = getChatHtml(currentWebview!, context.extensionUri, message.persona);
						break;
						
				}
			});
		}
	};

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("neurocode.chatView", provider)
	);
}

export function sendMessageToChat(payload: { text: string }) {
	if (!currentWebview) {
		console.warn('[ChatView] Webview is not ready.');
		return;
	}
	currentWebview.postMessage(payload);
}
