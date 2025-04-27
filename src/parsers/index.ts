import path, { resolve } from 'path';
import { spawn } from 'child_process';
import * as vscode from 'vscode';

function codeParser(language: string, context: vscode.ExtensionContext, code: string): Promise<any> {
    let parserCommand: string;
    let parserFile: string;

    switch(language) {
        case "python":
            parserFile = path.join(context.extensionPath, "src", "parsers", "python", "pythonParser.py");
            parserCommand = `python3 ${parserFile}`;            
            break;
        default:
            vscode.window.showInformationMessage("Unsupported Language");
            return Promise.resolve(null);
    };

    return new Promise((resolve, reject) => {
        const child = spawn(parserCommand, [], {shell: true});
        
        let output = "";
        let error = "";
        
        child.stdout.on('data', (data) => {
            output += data.toString();
        });

        child.stderr.on('data', (data) => {
            error += data.toString();
        });

        child.on('close', (code) => {
            if (code !== 0) {
                reject(error || "Parser Error");
            } else {
                try {
                    const parsed = JSON.parse(output);
                    resolve(parsed);
                } catch (e) {
                    reject("Failed to parse output");
                }
            }
        });

        child.stdin.write(code);
        child.stdin.end();
    });
};

export { codeParser };