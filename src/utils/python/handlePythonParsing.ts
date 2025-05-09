import * as vscode from 'vscode';
import { codeParser } from '../../parsers/index';

const handlePythonParsing = async (context: vscode.ExtensionContext, code: string, startline: number=0) => {
    if(!code) {
        return undefined;
    };
    try {
        const result = await codeParser("python", context, code, startline);
        const structuredCode = JSON.stringify(result, null, 2);

        return structuredCode;
    } catch(err) {
        return String(err);
    }
};

export { handlePythonParsing };