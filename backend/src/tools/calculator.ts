export async function calculatorTool(
	expression: string
) {
	try {

		if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
			return "Invalid expression.";
		}

		const result = Function(
			`"use strict"; return (${expression})`
		)();

		return result.toString();

	} catch {
		return "Calculation failed.";
	}
}
