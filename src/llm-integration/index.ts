import * as vscode from 'vscode';

import { runCohere } from "./cohere";
import { structurePrompt } from "./structurePrompt";

const callLLM = async(prompt: string, panel: vscode.WebviewPanel) => {
    try {
        // Cohere
        runCohere(prompt, panel);
    } catch (error) {
        throw error;
    }
};

export { structurePrompt, callLLM };