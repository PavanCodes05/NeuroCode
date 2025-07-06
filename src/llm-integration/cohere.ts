import * as vscode from 'vscode';
import { CohereClient } from "cohere-ai";

const runCohere = async (message: string, panel?: vscode.WebviewPanel) => {
    console.log("[runCohere] Entering");

    const CO_API_KEY = process.env.CO_API_KEY;

    if (!CO_API_KEY) {
        throw new Error("[runCohere] Missing CO_API_KEY");
    }

    const cohere = new CohereClient({ token: CO_API_KEY });

    if (panel) {
        try {
            const stream = await cohere.chatStream({
                model: "command-a-03-2025",
                message,
                chatHistory: []
            });

            for await (const chat of stream) {
                if (chat.eventType === "text-generation") {
                    panel.webview.postMessage({ type: "stream", chunk: chat.text });
                } else {
                    console.log(`[runCohere] Ignoring event type: ${chat.eventType}`);
                }
            }

        } catch (error) {
            console.error("[runCohere] Streaming error:", error);
            throw error;
        }
    } else {
        try {
            const chat = await cohere.chat({
                model: "command-a-03-2025",
                message,
                chatHistory: []
            });

            const rawresponse = chat.text;
            console.log("[runCohere] Raw response from LLM:\n", rawresponse);

            const jsonMatch = rawresponse.match(/```json\s*([\s\S]*?)\s*```/);
            if (!jsonMatch) {
                throw new Error("[runCohere] No JSON block found in LLM response");
            }

            const jsonString = jsonMatch[1];
            const parsedJson = JSON.parse(jsonString);
            console.log("[runCohere] Parsed JSON:", parsedJson);

            const startLine = parsedJson?.location?.start?.line;
            const endLine = parsedJson?.location?.end?.line;

            if (
                typeof parsedJson.modified_code !== 'string' ||
                typeof startLine !== 'number' ||
                typeof endLine !== 'number'
            ) {
                throw new Error("[runCohere] Missing or invalid fields in JSON response");
            }

            return {
                modifiedCode: parsedJson.modified_code,
                startLine: startLine - 1,
                endLine: endLine - 1,
            };

        } catch (error) {
            console.error("[runCohere] Error in chat response:", error);
            throw error;
        }
    }
};

const getPersonaFeedback = async (message: string) => {
    const CO_API_KEY = process.env.CO_API_KEY;
    if (!CO_API_KEY) {
        throw new Error("[getPersonaFeedback] Missing CO_API_KEY");
    }

    const cohere = new CohereClient({ token: CO_API_KEY });

    try {
        const chat = await cohere.chat({
            model: "command-a-03-2025",
            message,
            chatHistory: []
    });

        const rawresponse = chat.text;
        console.log("[getPersonaFeedback] Raw LLM response:\n", rawresponse);

        const jsonMatch = rawresponse.match(/```json\s*([\s\S]*?)\s*```/);
        if (!jsonMatch) {
            throw new Error("[getPersonaFeedback] No JSON block found in LLM response");
        }

        const jsonString = jsonMatch[1];
        const parsedJson = JSON.parse(jsonString);

        const { message: suggestionMessage, suggestion, reasoning, encouragement, priority } = parsedJson;

        return {
            message: suggestionMessage,
            suggestion,
            reasoning,
            encouragement,
            priority,
        };

    } catch (error) {
        console.error("[getPersonaFeedback] Error:", error);
        throw error;
    }
};


export { runCohere, getPersonaFeedback };