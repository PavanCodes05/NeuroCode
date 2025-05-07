
function getWebviewContent(): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>AI Output</title>
            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            <style>
                body { font-family: sans-serif; padding: 1rem; }
                #output { white-space: pre-wrap; }
            </style>
        </head>
        <body>
            <h2>NeuroCode - Explain Code</h2>
            <div id="output"></div>

            <script>
                const output = document.getElementById('output');
                let markdownBuffer = "";

                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.type === 'stream') {
                        markdownBuffer += message.chunk;

                        // Convert the current buffer to HTML
                        output.innerHTML = marked.parse(markdownBuffer);
                    }
                });
            </script>
        </body>
        </html>
`;

}


export { getWebviewContent };
  
