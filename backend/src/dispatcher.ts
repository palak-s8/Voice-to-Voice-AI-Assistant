import { toolFunctions } from "./toolRegistery";
import { dateTimeTool } from "./tools/dateTime";

export async function dispatchTool(
	name: keyof typeof toolFunctions,
	args: Record<string, any>
) {
	const tool = toolFunctions[name];

	if (!tool) {
		throw new Error(`Unknown tool: ${name}`);
	}

	switch (name) {
		case "weather":
			return await tool(args.city);

		case "search":
			return await tool(args.query);

		case "notes":
			return await tool(
				args.action,
				args.note
			);
		case "calculator":
			return await tool(args.expression);

		case "dateTime":
				return await dateTimeTool();

		default:
			throw new Error("Tool not implemented.");
	}
}