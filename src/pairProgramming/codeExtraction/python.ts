import { getIndentation, startsPythonBlock, isContinuation } from '../helpers/extractionHelpers';

interface CodeBlock {
    code: string;
    startLine: number;
    endLine: number;
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
    // Start from cursor and go up to find block start
    for (let i = cursorLine; i >= 0; i--) {
        const line = lines[i]?.trim();
        if (!line) {continue;}
        
        if (startsPythonBlock(line)) {
            return i;
        }
        
        // If we hit a line at base indentation that's not a block starter, 
        // check if current cursor area is part of a larger block
        if (getIndentation(lines[i]) === 0 && !startsPythonBlock(line)) {
            // Look for the nearest block above
            for (let j = i - 1; j >= 0; j--) {
                const upperLine = lines[j]?.trim();
                if (upperLine && startsPythonBlock(upperLine)) {
                    // Check if cursor line is part of this block
                    const blockEnd = findPythonBlockEnd(lines, j);
                    if (blockEnd > cursorLine) {
                        return j;
                    }
                }
            }
            break;
        }
    }
    
    // Fallback: extract current logical unit (function, class, etc.)
    return findNearestPythonBlock(lines, cursorLine);
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

export { extractPythonBlock }; 