import * as vscode from 'vscode';
import { codeParser } from '../../parsers/index';

const handlePythonParsing = async (context: vscode.ExtensionContext, code: string) => {
    try {
        const result = await codeParser("python", context, code);
        const structuredCode = JSON.stringify(result, null, 2);

        return structuredCode;
    } catch(err) {
        return String(err);
    }
};

export { handlePythonParsing };