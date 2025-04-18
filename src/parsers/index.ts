import { spawn } from 'child_process';
import path from 'path';

function pythonParser(context: string, code: string): Promise<any> {
    const pythonScriptPath = path.join(context, "src", "parsers", "pythonParser.py");

    const pyProcess = spawn('python3', [pythonScriptPath]);
    try {
        let output = '';
        let error = '';

        return new Promise((resolve, reject) => {
            // Listen for stdout data
            pyProcess.stdout.on('data', (chunk) => {
                output += chunk.toString();
            });

            // Listen for stderr data
            pyProcess.stderr.on('data', (chunk) => {
                error += chunk.toString();
            });

            // When the Python process ends
            pyProcess.on('close', (code) => {
                // Handle errors from Python process
                if (code !== 0 || error) {
                    return reject(new Error(`Python error: ${error}`));
                }
                try {
                    // Try to parse the output as JSON
                    const result = JSON.parse(output);
                    resolve(result);  // Return the parsed result
                } catch (e) {
                    reject(new Error('Failed to parse Python output as JSON.'));
                }
            });

            // Send the input to the Python process
            pyProcess.stdin.write(code);
            pyProcess.stdin.end();  // Signal that input is finished
        });
    } catch (error) {
        // Catch any error in the above process
        throw new Error(`Error occurred while calling Python parser: ${error}`);
    }
};

export { pythonParser };