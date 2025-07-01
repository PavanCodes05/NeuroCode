interface CodeBlock {
    code: string;
    startLine: number;
    endLine: number;
}

function extractGenericBlock(lines: string[], cursorLine: number): CodeBlock | null {
    // Generic extraction - get surrounding context
    const start = Math.max(0, cursorLine - 10);
    const end = Math.min(lines.length, cursorLine + 10);
    
    const code = lines.slice(start, end).join('\n');
    return { code, startLine: start, endLine: end };
}

export { extractGenericBlock };