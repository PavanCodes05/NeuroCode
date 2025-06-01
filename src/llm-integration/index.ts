import * as vscode from 'vscode';

import { runCohere } from "./cohere";
import { structurePrompt } from "./structurePrompt";

const callLLM = async(prompt: string, panel?: vscode.WebviewPanel) => {
    try {
        // Cohere
        const response = await retryRequests(() => runCohere(prompt, panel));
        return response;
    } catch (error) {
        throw error;
    }
};

const retryRequests = async<T>(fn: () => Promise<T>, retries = 3, delay = 1000) => {
    for(let i = 0; i <= retries; i++) {
        try {
            console.log("ATTEMPT: ", i + 1);
            return await fn();
        } catch (error) {
            if (i ===  retries) {throw error;};
            await new Promise(res => setTimeout(res, delay * (i + 1)));
        }
    }
    throw new Error("Failed After Retries!");
};

export { structurePrompt, callLLM };