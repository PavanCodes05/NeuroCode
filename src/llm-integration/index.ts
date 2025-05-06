import { runCohere } from "./cohere";
import { structurePrompt } from "./structurePrompt";

const callLLM = async(prompt: string) => {
    try {
        // Cohere
        const cohereResponse = runCohere(prompt);
        return cohereResponse;
    } catch (error) {
        throw error;
    }
};

export { structurePrompt, callLLM };