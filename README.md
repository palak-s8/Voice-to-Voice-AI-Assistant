# 🎤 Voice-to-Voice AI Assistant

An AI-powered Voice-to-Voice Assistant that enables users to interact naturally using speech. The assistant converts speech to text, understands user queries using GPT-4.1, performs tool-based tasks, and responds using natural voice.

---

## 🚀 Features

- 🎙️ Voice Recording
- 🗣️ Speech-to-Text using Sarvam AI
- 🤖 AI-powered conversations using GPT-4.1
- 🌦️ Real-time Weather Information
- 🔍 Web Search using Tavily
- 📝 Save and Retrieve Notes
- 🧮 Calculator
- 🕒 Current Date & Time
- 🔊 Text-to-Speech Responses
- 💬 Conversation Memory
- 🗑️ Clear Chat
- 📱 Clean and Responsive User Interface

---

## 🛠️ Technology Stack

### Frontend
- SvelteKit
- TypeScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- TypeScript

### AI & APIs
- GPT-4.1 (OpenRouter)
- Sarvam AI (Speech-to-Text)
- Browser SpeechSynthesis API (Text-to-Speech)
- Tavily Search API
- OpenWeather API

---

# 📂 Project Structure

```
VOICE-ASSISTANT
│
├── backend
│   ├── src
│   │   ├── services
│   │   │   ├── agent.ts
│   │   │   └── ai.ts
│   │   │
│   │   ├── tools
│   │   │   ├── calculator.ts
│   │   │   ├── dateTime.ts
│   │   │   ├── notes.ts
│   │   │   ├── search.ts
│   │   │   └── weather.ts
│   │   │
│   │   ├── dispatcher.ts
│   │   ├── server.ts
│   │   └── toolRegistery.ts
│   │
│   ├── uploads
│   ├── package.json
│   └── tsconfig.json
│
├── frontend
│   ├── src
│   ├── static
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone <repository-url>
```

---

## 2. Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the **backend** folder.

Add your API keys:

```
OPENROUTER_API_KEY=
SARVAM_API_KEY=
OPENWEATHER_API_KEY=
TAVILY_API_KEY=
```

---

## 4. Start the Backend

```bash
cd backend
npm run dev
```

---

## 5. Start the Frontend

```bash
cd frontend
npm run dev
```

Open:

```
http://localhost:5173
```

---

# 🔄 Workflow

1. User clicks **Start Listening**
2. Voice is recorded through the browser microphone.
3. Audio is sent to the backend.
4. Sarvam AI converts speech into text.
5. GPT-4.1 processes the request.
6. The assistant decides whether to use a tool.
7. The required tool executes (Weather, Search, Notes, Calculator, or Date & Time).
8. The response is sent back to the frontend.
9. The browser reads the response aloud using Text-to-Speech.

---

# 🧰 Available Tools

| Tool | Description |
|------|-------------|
| 🌦️ Weather | Fetches current weather information |
| 🔍 Search | Performs real-time web searches |
| 📝 Notes | Saves and retrieves notes |
| 🧮 Calculator | Solves mathematical expressions |
| 🕒 Date & Time | Returns the current date and time |

---

# 📸 Screenshots

### Home Screen

*(Add screenshot here)*

### Voice Interaction

*(Add screenshot here)*

### Weather Tool

*(Add screenshot here)*

### Calculator

*(Add screenshot here)*

### Notes Tool

*(Add screenshot here)*

---

# 🚀 Future Improvements

- Wake word detection ("Hey Assistant")
- Multi-language support
- Email integration
- Calendar integration
- Smart reminders
- Persistent chat history
- User authentication
- Mobile application

---

# 👩‍💻 Author

**Palak Shah**

B.Tech Information Technology

Voice-to-Voice AI Assistant Project