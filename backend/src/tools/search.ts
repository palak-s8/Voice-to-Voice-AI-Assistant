import { tavily } from "@tavily/core";

const tavilyClient = tavily({
	apiKey: process.env.TAVILY_API_KEY!
});

export async function searchTool(
	query: string
) {
	try {
		const results =
			await tavilyClient.search(
				query,
				{
					searchDepth: "basic",
					maxResults: 3
				}
			);

		return results.results;
	}
	catch (err) {
		console.error(err);

		return "Search failed.";
	}
}