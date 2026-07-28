import { weatherTool } from "./tools/weather";
import { notesTool } from "./tools/notes";
import { searchTool } from "./tools/search";
import { calculatorTool } from "./tools/calculator";
import { dateTimeTool } from "./tools/dateTime";

export const toolFunctions = {
	weather: weatherTool,
	notes: notesTool,
	search: searchTool,
	calculator: calculatorTool,
	dateTime: dateTimeTool,
};

export const toolDefinitions = [
	{
		type: "function" as const,
		function: {
			name: "weather",
			description:
				"Get the current weather for a city.",
			parameters: {
				type: "object",
				properties: {
					city: {
						type: "string"
					}
				},
				required: ["city"]
			}
		}
	},
	{
		type: "function" as const,
		function: {
			name: "notes",
			description:
    			"Use this tool whenever the user asks you to remember something, save information, recall previously saved information, retrieve notes, or forget stored information. Always use this tool for memory-related requests instead of answering from your own knowledge.",	
			parameters: {
				type: "object",
				properties: {
					action: {
						type: "string",
						enum: ["save", "read", "clear"],
						description:
							"save = store a new memory, read = retrieve stored memories, clear = delete all stored memories"
					},
					note: {
						type: "string",
						description:
							"The information that should be saved when action is 'save'."
					},
				},
				required: ["action"]
			}
		}
	},
	{
		type: "function" as const,
		function: {
			name: "search",
			description:
				"Search the web for factual information.",
			parameters: {
				type: "object",
				properties: {
					query: {
						type: "string"
					}
				},
				required: ["query"]
			}
		}
	},
	{
		type: "function",
		function: {
			name: "calculator",
			description:
			"This tool evaluates mathematical expressions.You MUST use this tool for every math-related request, including simple arithmetic. Never compute the answer yourself. Always call this tool first and use its returned result.",
			parameters: {
				type: "object",
				properties: {
					expression: {
						type: "string",
						description:
							"The mathematical expression to evaluate."
					}
				},
				required: ["expression"]
			}
		}
	},
	{
		type: "function",
		function: {
			name: "dateTime",
			description:
				"Use this tool whenever the user asks for the current date, current time, today's date, day, month, year, or time.",
			parameters: {
				type: "object",
				properties: {},
				required: []
			}
		}
	}
];