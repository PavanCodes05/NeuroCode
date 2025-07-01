import * as vscode from 'vscode';

export function getChatHtml(webview: any, extensionUri: any, persona: string = "mentor"): string {
	const nonce = getNonce();
	
	const imageFile = `${persona}.gif`;
	const petImageUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', imageFile));

	return /* html */`
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>NeurCode Buddy</title>
		<style>
			body {
				margin: 0;
				padding: 0;
				background-color: #1e1e1e;
				color: white;
				font-family: sans-serif;
				display: flex;
				flex-direction: column;
				height: 100vh;
			}

			#chat {
				flex: 1;
				overflow-y: auto;
				padding: 12px;
			}

			.message {
				background: #2c2c2c;
				margin: 6px 0;
				padding: 8px 12px;
				border-radius: 8px;
			}

			#controls {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10px;
				background-color: #252526;
				border-top: 1px solid #333;
			}

			select, button {
				background: #333;
				color: white;
				border: none;
				padding: 6px 10px;
				border-radius: 4px;
			}

			#pet {
				height: 60px;
				background-image: url("${petImageUri}");
				background-size: contain;
				background-repeat: no-repeat;
				align-self: center;
				margin-bottom: 10px;
			}
		</style>
	</head>
	<body>
	<div id="chat">
		<div class="message">Hi! I'm your coding buddy. Let's get started 🐾</div>
		
		<div class="message">
			<strong>Mentor 🧙‍♂️:</strong> Offers you guidance, tips, and support like an experienced dev would.
		</div>
		
		<div class="message">
			<strong>Rubber Duck 🦆:</strong> Asks thoughtful questions and helps you walk through your code logically. Great for debugging and explaining complex logic out loud.
		</div>
		
		<div class="message">
			<strong>Peer Programmer 👩‍💻👨‍💻:</strong> A coding buddy who brainstorms, shares ideas, and solves problems with you.
		</div>
		
		<div class="message">
			<strong>Code Critic 🧐:</strong> Reviews your logic and challenges you to write cleaner, more efficient code.
		</div>
	</div>

	<img id="pet" src="${petImageUri}" style="height: 160px; object-fit: contain;" />
	<div class="message">
			<strong> Current Buddy: ${persona.toUpperCase()}
	</div>


		<div id="controls">
			<select id="persona">
				<option value="mentor">Mentor</option>
				<option value="rubberDuck">Rubber Duck</option>
				<option value="peer">Peer Programmer</option>
				<option value="critic">Code Crtic</option>
			</select>
			<button onclick="switchPersona()">Switch</button>
		</div>

		<script nonce="${nonce}">
			const vscode = acquireVsCodeApi()


			function switchPersona() {
				const selected = document.getElementById('persona').value;
				vscode.postMessage({ command: 'personaChanged', persona: selected });
				appendMessage("Switched to " + selected);
			}

			function appendMessage(text) {
				const chat = document.getElementById('chat');
				const div = document.createElement('div');
				div.className = 'message';
				div.textContent = text;
				chat.appendChild(div);
				chat.scrollTop = chat.scrollHeight;
			}

			window.addEventListener('message', event => {
				const message = event.data;
				appendMessage(message.text);
			});
		</script>
	</body>
	</html>
	`;
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
