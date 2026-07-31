<script lang="ts">
	import { tick } from "svelte";
	import { fade } from "svelte/transition";

	let mediaRecorder: MediaRecorder;
	let audioChunks: Blob[] = [];
	let mediaStream: MediaStream;
	let chatContainer: HTMLDivElement;

	let status = $state("IDLE");
	let loading = $state(false);

	let messages = $state<
		{
			role: string;
			content: string;
			time: string;
		}[]
	>([]);

	function speak(text: string) {
		// speechSynthesis.cancel();
		
		console.log("Before speak:", status);

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = "en-US";
		console.log(speechSynthesis.getVoices());

		console.log("Number of voices:", speechSynthesis.getVoices().length);

		const voices = speechSynthesis.getVoices();

		const englishVoice = voices.find(
			voice =>
				voice.lang.startsWith("en") &&
				(
					voice.name.includes("Samantha") ||
					voice.name.includes("Karen") ||
					voice.name.includes("Daniel")
				)
		);

		if (englishVoice) {
			utterance.voice = englishVoice;
			console.log("Using voice:", englishVoice.name);
		}

		utterance.rate = 1;
		utterance.pitch = 1;
		utterance.volume = 1;

		utterance.onstart = () => {
			console.log("Speech started");
			console.log("Voice:", utterance.voice?.name);
		};

		utterance.onend = () => {
			console.log("Speech ended");
			status = "IDLE";
		};

		utterance.onerror = (e) => {
			console.log("Speech error", e);
			status = "IDLE";
		};


		console.log("Voices:", speechSynthesis.getVoices());
		console.log("Speaking text:", text);
		console.log("Speech synthesis speaking:", speechSynthesis.speaking);

		speechSynthesis.speak(utterance);

		setTimeout(() => {
			console.log(
				"15 sec timer",
				status,
				speechSynthesis.speaking,
				speechSynthesis.pending
			);

			if (status === "SPEAKING") {
				console.log("Forcing IDLE");
				speechSynthesis.cancel();
				status = "IDLE";
			}
		}, 15000);
	}

	async function startRecording() {
		try {
			mediaStream = await navigator.mediaDevices.getUserMedia({
				audio: true
			});

			audioChunks = [];

			mediaRecorder = new MediaRecorder(mediaStream);

			mediaRecorder.ondataavailable = (
				event
			) => {
				audioChunks.push(event.data);
			};

			mediaRecorder.onstop = async () => {
				console.log("onstop fired");

				const audioBlob = new Blob(audioChunks, {
					type: "audio/webm"
				});

				console.log("Blob size:", audioBlob.size);

				const formData = new FormData();

				formData.append(
					"audio",
					audioBlob,
					"recording.webm"
				);

				try {
					loading = true;
					status = "TRANSCRIBING";

					console.log("Before fetch");

					const response = await fetch(
						"https://voice-to-voice-ai-assistant.onrender.com/upload",
						{
							method: "POST",
							body: formData
						}
					);

					console.log("After fetch:", response.status);

					status = "THINKING";

					const data = await response.json();

					console.log("Backend response:", data);

					messages.push({
						role: "user",
						content: data.transcript,
						time: new Date().toLocaleTimeString("en-IN", {
							hour: "2-digit",
							minute: "2-digit",
							hour12: true
						})
					});

					messages.push({
						role: "assistant",
						content: data.response,
						time: new Date().toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit"
						})
					});

					await tick();

					chatContainer.scrollTop =
						chatContainer.scrollHeight;

					status = "SPEAKING";

					speak(data.response);

					loading = false;

					mediaStream.getTracks().forEach(track => track.stop());

				} catch (err) {
					console.error("FETCH FAILED:", err);
				}
			};

			mediaRecorder.start();

			status = "LISTENING";
		} catch (error) {
			loading = false;
			console.error(error);
		}
	}

	function stopRecording() {
		if (mediaRecorder && mediaRecorder.state !== "inactive") {
			mediaRecorder.stop();
		}

		if (mediaStream) {
			mediaStream.getTracks().forEach(track => track.stop());
		}

		status = "IDLE";
	}

	function clearChat() {
		messages = [];
	}
</script>

<div class="app">
	<div class="container">
		<h1>🎤 Voice-to-Voice AI Assistant</h1>

		<p class="subtitle">
			AI Voice Assistant powered by GPT-4.1
		</p>

		<div class="status">
			Status:
			{#if status === "IDLE"}
				🟢 Ready
			{:else if status === "LISTENING"}
				🎤 Listening...
			{:else if status === "TRANSCRIBING"}
				📝 Transcribing...
			{:else if status === "THINKING"}
				🤖 Thinking...
			{:else if status === "SPEAKING"}
				🔊 Speaking...
			{/if}
		</div>

		<div class="controls">
			<button
				onclick={startRecording}
				disabled={status !== "IDLE"}
			>
				🎤 Start Listening
			</button>

			<button
				onclick={stopRecording}
				disabled={status !== "LISTENING"}
			>
				⏹ Stop
			</button>

			<button
				class="clear-btn"
				onclick={clearChat}
				disabled={status !== "IDLE"}
			>
				🗑 Clear Chat
			</button>
		</div>

		<div
			class="chat"
			bind:this={chatContainer}
		>
			{#if messages.length === 0}
				<div class="empty">
					<h2>👋 Welcome to Palak's Assistant</h2>

					<p>I'm your AI Voice Assistant.</p>

					<div class="features">
						<div>🌦 Weather</div>
						<div>🔍 Web Search</div>
						<div>📝 Notes</div>
						<div>🧮 Calculator</div>
						<div>🕒 Date & Time</div>
					</div>

					<p class="hint">
						Press <b>Start Listening</b> to begin.
					</p>
				</div>
			{/if}

			{#each messages as message}
				<div
					class="message-row {message.role}"
					in:fade={{ duration: 250 }}
				>
					<div class="message-bubble {message.role}">
						<div class="sender">
							<span>
								{message.role === "user"
									? "👤 You"
									: "🤖 Assistant"}
							</span>

							<span class="time">
								{message.time}
							</span>
						</div>

						<div class="content">
							{message.content}
						</div>
					</div>
				</div>
			{/each}
			{#if loading}
				<div class="message-row assistant">
					<div class="message-bubble assistant">
						🤖 Thinking...
					</div>
				</div>
			{/if}
		</div>
		<div class="footer">
			Powered by OpenRouter • GPT-4.1 • Sarvam AI
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: Inter, Arial, sans-serif;
		background: #0f172a;
		color: white;
	}

	.app {
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px;
		box-sizing: border-box;
	}

	.container {
		width: 100%;
		max-width: 900px;
		height: 90vh;
		background: #1e293b;
		border-radius: 20px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);
	}

	h1 {
		text-align: center;
		margin-bottom: 10px;
	}

	.subtitle {
		text-align: center;
		margin-top: -5px;
		margin-bottom: 15px;
		color: #94a3b8;
		font-size: 15px;
	}

	.status {
		text-align: center;
		margin-bottom: 20px;
		font-size: 18px;
	}

	.controls {
		display: flex;
		justify-content: center;
		gap: 18px;
		margin-bottom: 20px;
	}

	button {
		padding: 12px 20px;
		border: none;
		border-radius: 12px;
		font-size: 15px;
		font-weight: bold;
		cursor: pointer;
		background: #2563eb;
		color: white;
		transition: 0.2s;
	}

	button:hover:not(:disabled) {
		transform: translateY(-2px);
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.clear-btn {
		background: #dc2626;
	}

	.clear-btn:hover:not(:disabled) {
		background: #b91c1c;
	}

	.chat {
		flex: 1;
		overflow-y: auto;
		padding: 10px;
		border-radius: 12px;
		background: #0f172a;
	}

	.message-row {
		display: flex;
		margin: 12px 0;
	}

	.message-row.user {
		justify-content: flex-end;
	}

	.message-row.assistant {
		justify-content: flex-start;
	}

	.message-bubble {
		max-width: 70%;
		padding: 12px;
		border-radius: 16px;
	}

	.message-bubble.user {
		background: #2563eb;
		color: white;
	}

	.message-bubble.assistant {
		background: #334155;
		color: white;
	}

	.sender {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;
		margin-bottom: 6px;
	}

	.time {
		font-size: 12px;
		color: #cbd5e1;
		font-weight: normal;
	}

	.content {
		line-height: 1.5;
	}

	.empty {
		text-align: center;
		color: #94a3b8;
		margin-top: 50px;
	}
	.features {
		display:grid;
		grid-template-columns:repeat(2,1fr);
		gap:12px;
		margin:20px auto;
		max-width:350px;
	}

	.features div {
		background: #1e293b;
		padding: 14px;
		border-radius: 12px;
		font-weight: 600;
		border: 1px solid rgba(255,255,255,0.08);
		transition: 0.2s;
	}

	.features div:hover {
		transform: translateY(-2px);
		background: #273449;
	}

	.hint{
		margin-top:20px;
		color:#94a3b8;
	}
</style>