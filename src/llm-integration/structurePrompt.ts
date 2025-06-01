import { systemPrompts } from "./systemPrompt";

const structurePrompt = (command: string, language: string, structuredCode?: string, context?: any, userPrompt?: string) => {
    const SystemPrompt = systemPrompts(command);

    let parsedStructuredCode: any = undefined;

    try {
        parsedStructuredCode = structuredCode ? JSON.parse(structuredCode) : undefined;
    } catch (error) {
        console.warn("Invalid structuredCode JSON:", error);   
    }
    
    const now = new Date();
    const date = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const UID = `Request ID: ${date}:${hours}:${minutes}:${seconds}`;
    const systemMessage = `System: ${SystemPrompt}`;
    const userMessage = `User:\n${JSON.stringify({
        language,
        structuredCode: parsedStructuredCode,
        context,
        userPrompt
    }, null, 2)}`;

    const coherePrompt = `${UID}\n\n${systemMessage}\n\n${userMessage}`;
    
    return coherePrompt;
};

export { structurePrompt };