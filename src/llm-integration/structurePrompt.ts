import { systemPrompts } from "./systemPrompt";

const structurePrompt = (command: string, language: string, structuredCode?: string, context?: any, userPrompt?: string) => {
    const SystemPrompt = systemPrompts(command);

    let parsedStructuredCode: any = undefined;

    try {
        parsedStructuredCode = structuredCode ? JSON.parse(structuredCode) : undefined;
        console.log(parsedStructuredCode);
    } catch (error) {
        console.warn("Invalid structuredCode JSON:", error);   
    }

    const systemMessage = `System: ${SystemPrompt}`;
    const userMessage = `User:\n${JSON.stringify({
        language,
        structuredCode: parsedStructuredCode,
        context,
        userPrompt
    }, null, 2)}`;

    const coherePrompt = `${systemMessage}\n\n${userMessage}`;
    
    return coherePrompt;
};

export { structurePrompt };