export async function dateTimeTool() {
	const now = new Date();

	return {
		date: now.toLocaleDateString("en-IN"),
		time: now
			.toLocaleTimeString("en-IN", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true
			})
	};
}