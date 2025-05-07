import * as vscode from 'vscode';
import { CohereClient } from "cohere-ai";

const runCohere = async (message: string, panel: vscode.WebviewPanel) => {
    console.log("[runCohere] Entering");

    const CO_API_KEY = process.env.CO_API_KEY;

    if (!CO_API_KEY) {
        console.error("[runCohere] Missing CO_API_KEY");
        panel.webview.postMessage({ type: "error", text: "Missing API key" });
        return;
    }

    const cohere = new CohereClient({
        token: CO_API_KEY,
    });

    try {
        const stream = await cohere.chatStream({
            model: "command-a-03-2025",
            message: message,
        });

        console.log("[runCohere] Stream started");

        for await (const chat of stream) {
            if (chat.eventType === "text-generation") {
                const chunk = chat.text;
                panel.webview.postMessage({ type: "stream", chunk });
            } else {
                console.log("[runCohere] Ignoring event type:", chat.eventType);
            }
        }

        console.log("[runCohere] Stream ended");
    } catch (error) {
        console.error("[runCohere] Error:", error);
        panel.webview.postMessage({ type: "error", text: "Streaming error: " + error });
    }
};

export { runCohere };
