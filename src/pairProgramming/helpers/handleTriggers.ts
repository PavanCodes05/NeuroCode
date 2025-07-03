import * as vscode from 'vscode';
import { identifyLanguage } from '../../utils/index';
import { extractCodeBlock } from '../index';
import { getIndentation, isContinuation, startsPythonBlock } from './extractionHelpers';

interface ExtractedCode {
    code: string;
    startLine: number;
    endLine: number;
    language: string;
}

async function trigger(editor: vscode.TextEditor): Promise<ExtractedCode | undefined> {
    const lang = identifyLanguage();
    if(!lang){return undefined;};
    const doc = editor.document;
    const cursor = editor.selection.active;
    const documentText = doc.getText();
    const lineCount = doc.lineCount;

    // Early return for insufficient content
    if (lineCount < 5 || documentText.trim().length < 10) {
        return undefined;
    }

    console.log('User paused typing at line:', cursor.line);

    try {
        const extractedCode = extractCodeBlock(doc, cursor.line, lang);
        if (extractedCode && validateExtractedCode(extractedCode.code, lang)) {
            console.log("Extracted code block:", extractedCode);
            return {
                code: extractedCode.code,
                startLine: extractedCode.startLine,
                endLine: extractedCode.endLine,
                language: lang
            };
        } else {
            console.log("Invalid or incomplete code extracted, skipping...");
            return undefined;
        }
    } catch (error) {
        console.error('Error extracting code block:', error);
        vscode.window.showErrorMessage(`Error extracting code: ${error}`);
    }

    return undefined;
}

function validateExtractedCode(code: string, language: string): boolean {
    const trimmedCode = code.trim();
    
    // Must have minimum length
    if (trimmedCode.length < 10) {return false;}
    
    // Must have multiple lines for meaningful context
    const lines = trimmedCode.split('\n').filter(line => line.trim());
    if (lines.length < 2) {return false;}
    
    switch (language.toLowerCase()) {
        case 'python':
            return validatePythonCode(trimmedCode);
        case 'javascript':
        case 'typescript':
            return validateJavaScriptCode(trimmedCode);
        default:
            return true; // Basic validation passed
    }
}

function validatePythonCode(code: string): boolean {
    const lines = code.split('\n');
    const firstLine = lines[0]?.trim();
    
    // Should start with a proper Python construct
    if (!firstLine || !startsPythonBlock(firstLine)) {
        return false;
    }
    
    // Check for balanced indentation
    const baseIndent = getIndentation(lines[0]);
    let hasContent = false;
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line?.trim();
        
        if (trimmed) {
            hasContent = true;
            const indent = getIndentation(line);
            // Should have proper indentation structure
            if (indent < baseIndent && !isContinuation(trimmed)) {
                break; // Natural end of block
            }
        }
    }
    
    return hasContent;
}

function validateJavaScriptCode(code: string): boolean {
    // Basic validation for JavaScript
    const braceCount = (code.match(/\{/g) || []).length - (code.match(/\}/g) || []).length;
    return Math.abs(braceCount) <= 1; // Allow slight imbalance for incomplete blocks
}

export { trigger, ExtractedCode };