import dotenv from "dotenv";
dotenv.config();
import express from "express";
import axios from "axios";
import { tavily } from "@tavily/core";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { SarvamAIClient } from "sarvamai";
import OpenAI from "openai";
import { runAgent } from "./services/agent";
let silenceTimer: number;

if (!fs.existsSync("uploads")) {
	fs.mkdirSync("uploads", { recursive: true });
}



const app = express();

app.use(cors());
app.use(express.json());

const sarvam = new SarvamAIClient({
	apiSubscriptionKey: process.env.SARVAM_API_KEY!
});

const openrouter = new OpenAI({
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: "https://openrouter.ai/api/v1"
});
const tavilyClient = tavily({
	apiKey: process.env.TAVILY_API_KEY!
  });

const conversationHistory: any[] = [
	{
		role: "system",
		content:
		"You are a helpful voice assistant.Use the provided search results to answer questions.Do not mention search results,sources,web searches,or verification unless specifically asked.Answer naturally and conversationally.Keep answers concise.For any request involving arithmetic or mathematical calculations, always use the calculator tool instead of solving it yourself.You are an AI agent with access to tools.Rules:- For ANY mathematical calculation, arithmetic, percentage, multiplication, division, subtraction, addition, square root, exponent, or expression evaluation, ALWAYS use the calculator tool.- Never solve math yourself.- Wait for the calculator tool's result and then answer the user using that result."
	}
];

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, "uploads/");
	},

	filename: (_req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	}
});

const upload = multer({ storage });





app.get("/", (_req, res) => {
	res.send("Voice Assistant Backend Running");
});

app.get("/test-sarvam", (_req, res) => {
	res.json({
		keyLoaded: !!process.env.SARVAM_API_KEY
	});
});

app.get("/test-ai", async (_req, res) => {
	try {
		const completion =
			await openrouter.chat.completions.create({
				model: "openai/gpt-oss-20b",
				messages: [
					{
						role: "user",
						content: "Say hello"
					}
				]
			});

		res.json({
			reply:
				completion.choices[0].message.content
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			error: "AI failed"
		});
	}
});

app.post(
    "/upload",
    upload.single("audio"),
    async (req, res) => {
        console.log("===== /upload called =====");
        console.log("req.file:", req.file);

        try {
            if (!req.file) {
                return res.status(400).json({
                    error: "No audio uploaded"
                });
            }

            console.log("Starting transcription...");

            const result = await sarvam.speechToText.transcribe({
                file: fs.createReadStream(req.file.path)
            });

            const transcript = result.transcript;
            console.log("Transcript:", transcript);

            const response = await runAgent(
				transcript,
				conversationHistory
			);

            return res.json({
                transcript,
                response
            });
        } catch (error: any) {
            console.error(error);

            return res.status(500).json({
                error: error?.message || "Processing failed"
            });
        }
    }
);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});