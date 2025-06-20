import * as vscode from 'vscode';
import { CohereClient } from "cohere-ai";

const runCohere = async (message: string, panel?: vscode.WebviewPanel) => {
    console.log("[runCohere] Entering");

    const CO_API_KEY = process.env.CO_API_KEY;

    if (!CO_API_KEY) {
        const msg = "[runCohere] Missing CO_API_KEY";
        throw new Error(msg);
    }

    const cohere = new CohereClient({
        token: CO_API_KEY,
    });

    if(panel) {
        try {
            const stream = await cohere.chatStream({
                model: "command-a-03-2025",
                message: message,
            });
            
                for await (const chat of stream) {
                    if (chat.eventType === "text-generation") {
                        const chunk = chat.text;
                        panel.webview.postMessage({ type: "stream", chunk });
                    } else {
                        console.log(`[runCohere] Ignoring event type: ${chat.eventType}`);
                    }
                };
            } catch (error) {
                throw error;
            }
    };

    if(!panel) {
        try{
            const chat = await cohere.chat({
                model: "command-a-03-2025",
                message: message
            });
            
            const rawresponse = chat.text;

            const jsonMatch = rawresponse.match(/```json\s*([\s\S]*?)\s*```/);
            if (!jsonMatch) {
                throw new Error("[runCohere] No JSON block found in LLM response");
            }
            
            const jsonString = jsonMatch[1];
            const parsedJson = JSON.parse(jsonString);

            return {
                modifiedCode: parsedJson.modified_code,
                startLine: parsedJson.location.start.line - 1, 
                endLine: parsedJson.location.end.line - 1,
            };

        } catch(error) {
            throw error;
        }
    }

    };

export { runCohere };
