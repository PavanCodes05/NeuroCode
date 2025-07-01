import * as vscode from 'vscode';

interface CodeBlock {
    code: string;
    startLine: number;
    endLine: number;
}

function extractCodeBlock(document: vscode.TextDocument, cursorLine: number, language: string): CodeBlock | null {
    const lines = document.getText().split('\n');
    
    if (cursorLine < 0 || cursorLine >= lines.length) {
        return null;
    }

    switch (language.toLowerCase()) {
        case 'python':
            return extractPythonBlock(lines, cursorLine);
        case 'javascript':
        case 'typescript':
            return extractJavaScriptBlock(lines, cursorLine);
        case 'java':
        case 'c++':
        case 'c#':
            return extractBracedBlock(lines, cursorLine);
        default:
            return extractGenericBlock(lines, cursorLine);
    }
}

function extractPythonBlock(lines: string[], cursorLine: number): CodeBlock | null {
    // Find the start of the current block
    let start = findPythonBlockStart(lines, cursorLine);
    if (start === -1) {return null;}

    // Find the end of the block
    let end = findPythonBlockEnd(lines, start);
    
    const code = lines.slice(start, end).join('\n');
    return { code, startLine: start, endLine: end };
}

function findPythonBlockStart(lines: string[], cursorLine: number): number {
    const currentIndent = getIndentation(lines[cursorLine]);
    
    // First, find the function/class that contains this line
    for (let i = cursorLine; i >= 0; i--) {
        const line = lines[i]?.trim();
        if (!line) {continue;}
        
        const lineIndent = getIndentation(lines[i]);
        
        // Found a function/class definition at a lower or equal indentation level
        if ((line.startsWith('def ') || line.startsWith('class ')) && lineIndent <= currentIndent) {
            return i;
        }
        
        // If we're in a nested block, find the outermost containing block
        if (startsPythonBlock(line) && lineIndent < currentIndent) {
            // Check if this block contains our cursor line
            const blockEnd = findPythonBlockEnd(lines, i);
            if (blockEnd > cursorLine) {
                // Continue looking for the function/class that contains this block
                continue;
            }
        }
    }
    
    // Fallback: look for any containing block
    for (let i = cursorLine; i >= 0; i--) {
        const line = lines[i]?.trim();
        if (line && startsPythonBlock(line)) {
            const blockEnd = findPythonBlockEnd(lines, i);
            if (blockEnd > cursorLine) {
                return i;
            }
        }
    }
    
    return Math.max(0, cursorLine - 5);
}

function findNearestPythonBlock(lines: string[], cursorLine: number): number {
    // Look for the nearest function/class definition
    for (let i = cursorLine; i >= 0; i--) {
        const line = lines[i]?.trim();
        if (line && (line.startsWith('def ') || line.startsWith('class '))) {
            return i;
        }
    }
    
    // If no function/class found, find a meaningful block
    for (let i = Math.max(0, cursorLine - 10); i <= Math.min(lines.length - 1, cursorLine + 10); i++) {
        const line = lines[i]?.trim();
        if (line && startsPythonBlock(line)) {
            return i;
        }
    }
    
    return Math.max(0, cursorLine - 5); // Fallback to nearby lines
}

function findPythonBlockEnd(lines: string[], start: number): number {
    const baseIndent = getIndentation(lines[start]);
    let end = start + 1;

    while (end < lines.length) {
        const line = lines[end];
        if (line === undefined) {break;}

        const trimmed = line.trim();
        const indent = getIndentation(line);

        // Empty lines are part of the block
        if (trimmed === '') {
            end++;
            continue;
        }

        // Lines with greater indentation are part of the block
        if (indent > baseIndent) {
            end++;
            continue;
        }

        // Lines with same indentation that are continuations (elif, else, except)
        if (indent === baseIndent && isContinuation(trimmed)) {
            end++;
            continue;
        }

        // We've reached the end of the block
        break;
    }

    return end;
}

function extractJavaScriptBlock(lines: string[], cursorLine: number): CodeBlock | null {
    // Find function/class/block boundaries using braces
    let start = cursorLine;
    let braceCount = 0;
    
    // Go up to find start
    while (start >= 0) {
        const line = lines[start]?.trim();
        if (!line) {
            start--;
            continue;
        }
        
        if (startsJavaScriptBlock(line)) {
            break;
        }
        start--;
    }
    
    if (start < 0) {start = Math.max(0, cursorLine - 5);}
    
    // Find end by matching braces
    let end = start;
    for (let i = start; i < lines.length; i++) {
        const line = lines[i];
        braceCount += (line.match(/\{/g) || []).length;
        braceCount -= (line.match(/\}/g) || []).length;
        
        end = i + 1;
        if (braceCount === 0 && i > start) {break;}
    }
    
    const code = lines.slice(start, end).join('\n');
    return { code, startLine: start, endLine: end };
}

function extractBracedBlock(lines: string[], cursorLine: number): CodeBlock | null {
    // Similar to JavaScript but with different block identifiers
    return extractJavaScriptBlock(lines, cursorLine);
}

function extractGenericBlock(lines: string[], cursorLine: number): CodeBlock | null {
    // Generic extraction - get surrounding context
    const start = Math.max(0, cursorLine - 10);
    const end = Math.min(lines.length, cursorLine + 10);
    
    const code = lines.slice(start, end).join('\n');
    return { code, startLine: start, endLine: end };
}

// Helper functions
function startsPythonBlock(line: string): boolean {
    const blockStarters = [
        'def ', 'class ', 'for ', 'while ', 'if ', 'elif ', 'else:', 
        'try:', 'except ', 'finally:', 'with ', 'async def ', '@'
    ];
    return blockStarters.some(starter => line.startsWith(starter));
}

function startsJavaScriptBlock(line: string): boolean {
    const blockStarters = [
        'function ', 'class ', 'if ', 'for ', 'while ', 'switch ', 
        'try ', 'catch ', 'const ', 'let ', 'var ', '=>'
    ];
    return blockStarters.some(starter => line.includes(starter)) || line.includes('{');
}

function isContinuation(line: string): boolean {
    return line.startsWith('elif ') || line.startsWith('else:') || 
           line.startsWith('except ') || line.startsWith('finally:');
}

function getIndentation(line: string | undefined): number {
    if (!line) {return 0;}
    return line.length - line.trimStart().length;
}

export { extractCodeBlock, CodeBlock };