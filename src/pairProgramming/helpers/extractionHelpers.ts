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

export { getIndentation, isContinuation, startsPythonBlock, startsJavaScriptBlock }; 