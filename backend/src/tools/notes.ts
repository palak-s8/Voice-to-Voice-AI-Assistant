import fs from "fs";

function loadNotes() {
	try {
		const data = fs.readFileSync(
			"notes.json",
			"utf-8"
		);

		return JSON.parse(data);
	}
	catch {
		return [];
	}
}

function saveNotes(
	notes: string[]
) {
	fs.writeFileSync(
		"notes.json",
		JSON.stringify(notes, null, 2)
	);
}

export async function notesTool(
	action: string,
	note?: string
) {
	if (action === "save") {
		const notes =
			loadNotes();

		notes.push(note);

		saveNotes(notes);

		return "I've saved that note.";
	}

	if (action === "read") {
		const notes =
			loadNotes();

		if (notes.length === 0) {
			return "You don't have any saved notes.";
		}

		return notes.join(". ");
	}

	if (action === "clear") {
		saveNotes([]);

		return "All your notes have been deleted.";
	}

	return "Unknown notes action.";
}