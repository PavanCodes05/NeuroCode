import { CohereClient } from "cohere-ai";

const runCohere = async (message: string) => {
    const CO_API_KEY = process.env.CO_API_KEY;

    const cohere = new CohereClient({
        token: CO_API_KEY,
    });

    const chat = await cohere.chat({
        model: "command-a-03-2025",
        message: message
    });

    return chat;
};

export { runCohere };
