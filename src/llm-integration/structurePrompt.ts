import { systemPrompts } from "./systemPrompt";

const structurePrompt = (
    command: string,
    language: string,
    structuredCode?: string,
    context?: any,
    userPrompt?: string
    ) => {
    const SystemPrompt = systemPrompts(command);

    let parsedStructuredCode: any = undefined;
    let rawCode: string = "";

    try {
        parsedStructuredCode = structuredCode ? JSON.parse(structuredCode) : undefined;
        if (parsedStructuredCode?.code) {
        rawCode = parsedStructuredCode.code;
        }
    } catch (error) {
        console.warn("⚠️ Failed to parse structuredCode JSON:", error);
    }

    const now = new Date();
    const UID = `Request ID: ${now.getDate()}:${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    const codeBlock = rawCode
        ? `\n\`\`\`${language.toLowerCase()}\n${rawCode}\n\`\`\`\n`
        : "";

    const userMessage = `User:\n${JSON.stringify(
        {
        language,
        structuredCode: parsedStructuredCode,
        context,
        userPrompt,
        },
        null,
        2
    )}`;

    const coherePrompt = `${UID}\n\nSystem:\n${SystemPrompt}\n${codeBlock}\n${userMessage}`;

    return coherePrompt;
};

export { structurePrompt };
