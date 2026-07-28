import { askAI } from "./ai";
import { dispatchTool } from "../dispatcher";
import { toolDefinitions } from "../toolRegistery";

export async function runAgent(
	userMessage: string,
	conversationHistory: any[]
) {
	conversationHistory.push({
		role: "user",
		content: userMessage
	});
	
	const messages = conversationHistory;

	if (
		/\b(time|date|today|day|month|year|clock)\b/i.test(userMessage)
	) {
		const result = await dispatchTool("dateTime", {});
		return `Current Date: ${result.date}\nCurrent Time: ${result.time}`;
	}

	let toolChoice = undefined;

	if (
		/\d/.test(userMessage) &&
		/(calculate|plus|minus|times|multiply|divide|\+|-|\*|\/)/i.test(userMessage)
	) {
		const expression = userMessage
			.replace(/calculate/i, "")
			.trim();
	
		const result = await dispatchTool("calculator", {
			expression
		});
	
		return result;
	}

	const firstResponse = await askAI(
		messages,
		toolDefinitions,
		toolChoice
	);

	const assistantMessage =
		firstResponse.choices[0].message;
	


	// No tool needed
	if (!assistantMessage.tool_calls) {

		conversationHistory.push(assistantMessage);
	
		return assistantMessage.content;
	}

	// Execute every tool
	for (const toolCall of assistantMessage.tool_calls) {

		if (toolCall.type !== "function") {
			continue;
		}
	
		const toolName = toolCall.function.name;
	
		const args = JSON.parse(
			toolCall.function.arguments
		);
	
		const toolResult = await dispatchTool(
			toolName as any,
			args
		);
	
		messages.push({
			role: "tool",
			tool_call_id: toolCall.id,
			content:
				typeof toolResult === "string"
					? toolResult
					: JSON.stringify(toolResult)
		});



	}
	
	// Second AI call
	const finalResponse =
		await askAI(
			messages
		);

		const finalMessage =
		finalResponse.choices[0].message;
	
	conversationHistory.push(finalMessage);
	
	return finalMessage.content;
}