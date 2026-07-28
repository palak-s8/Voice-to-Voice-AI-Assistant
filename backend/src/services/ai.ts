import OpenAI from "openai";

const openrouter = new OpenAI({
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: "https://openrouter.ai/api/v1"
});

export async function askAI(
	messages: any[],
	tools?: any[],
	toolChoice?: any
) {
	const completion =
	await openrouter.chat.completions.create({
		model: "openai/gpt-4.1",
		messages,
		tools,
		tool_choice: toolChoice,
		max_tokens: 500
	});

	return completion;
}