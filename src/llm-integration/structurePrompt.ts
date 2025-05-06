import { systemPrompts } from "./systemPrompt";

const structurePrompt = (command: string, language: string, structuredCode: string, context: any) => {
    const SystemPrompt = systemPrompts(command);

    const promptDesign = {
        role: SystemPrompt,
        language: language, 
        structuredCode: structuredCode, 
        context: context
    };
    const prompt = JSON.stringify(promptDesign, null, 2);

    return prompt;
};

export { structurePrompt };