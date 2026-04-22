// AI-Powered Chatbot with Persistence and Typing Indicator
(function () {
	document.addEventListener('DOMContentLoaded', () => {
		const bubble = document.querySelector('.chatbot-bubble');
		const windowEl = document.querySelector('.chatbot-window');
		const closeBtn = document.querySelector('.chatbot-close');
		const form = document.querySelector('.chatbot-input');
		const input = document.getElementById('chat-input');
		const messages = document.querySelector('.chatbot-messages');

		if (!bubble || !windowEl || !form || !input || !messages) return;

		const API_KEY = 'AIzaSyDDMZbTBUaJ5CTGS0fCW8IiJSOQcAqNwjk';
		const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

		let chatHistory = [];

		// Load state
		try {
			const savedState = sessionStorage.getItem('urbanease_chatbot_ai');
			if (savedState) {
				chatHistory = JSON.parse(savedState);
			}
		} catch(e) {
			console.error('Could not load chat history');
		}

		function saveState() {
			sessionStorage.setItem('urbanease_chatbot_ai', JSON.stringify(chatHistory));
		}

		function renderMessage(text, sender) {
			const el = document.createElement('div');
			el.className = `msg ${sender}`;
			// Simple formatting
			let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
			formattedText = formattedText.replace(/\n/g, '<br>');
			el.innerHTML = formattedText;
			messages.appendChild(el);
			messages.scrollTop = messages.scrollHeight;
		}

		async function generateAIResponse() {
			// Add typing indicator
			const typing = document.createElement('div');
			typing.className = 'msg bot typing-indicator';
			typing.textContent = '...';
			messages.appendChild(typing);
			messages.scrollTop = messages.scrollHeight;

			try {
				const contents = chatHistory.map(msg => ({
					role: msg.role,
					parts: [{ text: msg.text }]
				}));

				const response = await fetch(API_URL, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						systemInstruction: {
							parts: [{ text: "You are the UrbanEase Assistant, a trendy and helpful concierge for a city discovery platform called UrbanEase. You help users find restaurants, fitness studios, salons, and wellness spots. Keep your responses brief, friendly, and formatted nicely. Never mention that you are an AI. Use emojis." }]
						},
						contents: contents
					})
				});

				const data = await response.json();
				typing.remove();

				if (data.candidates && data.candidates.length > 0) {
					const botReply = data.candidates[0].content.parts[0].text;
					chatHistory.push({ role: 'model', text: botReply });
					saveState();
					renderMessage(botReply, 'bot');
				} else {
					console.error("Unexpected API response:", data);
					renderMessage("I'm sorry, I couldn't process that right now.", 'bot');
				}
			} catch (error) {
				console.error("AI Error:", error);
				typing.remove();
				renderMessage("I'm having trouble connecting right now. Please try again later.", 'bot');
			}
		}

		function openChat() {
			windowEl.classList.add('open');
			if (chatHistory.length === 0) {
				const welcome = 'Hi there 👋! I’m the UrbanEase AI assistant. How can I help you discover the city today?';
				chatHistory.push({ role: 'model', text: welcome });
				saveState();
				renderMessage(welcome, 'bot');
			}
		}
		
		function closeChat() {
			windowEl.classList.remove('open');
		}

		// Restore history on load
		if (chatHistory.length > 0) {
			chatHistory.forEach(msg => renderMessage(msg.text, msg.role === 'model' ? 'bot' : 'user'));
		}

		bubble.addEventListener('click', () => {
			if (windowEl.classList.contains('open')) {
				closeChat();
			} else {
				openChat();
			}
		});
		if (closeBtn) closeBtn.addEventListener('click', closeChat);

		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			const text = input.value.trim();
			if (!text) return;
			
			// Add user message
			chatHistory.push({ role: 'user', text });
			saveState();
			renderMessage(text, 'user');
			input.value = '';

			// Generate AI response
			const submitBtn = form.querySelector('button[type="submit"]');
			submitBtn.disabled = true;
			submitBtn.style.opacity = '0.5';
			await generateAIResponse();
			submitBtn.disabled = false;
			submitBtn.style.opacity = '1';
			input.focus();
		});
	});
})();
