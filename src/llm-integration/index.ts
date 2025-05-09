import * as vscode from 'vscode';

import { runCohere } from "./cohere";
import { structurePrompt } from "./structurePrompt";

const callLLM = async(prompt: string, panel?: vscode.WebviewPanel) => {
    try {
        // Cohere
        const response = runCohere(prompt, panel);
        return response;
    } catch (error) {
        throw error;
    }
};

export { structurePrompt, callLLM };