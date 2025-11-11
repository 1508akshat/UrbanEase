// Navigation toggle (mobile)
(function () {
	const toggle = document.querySelector('.nav-toggle');
	const links = document.querySelector('.nav-links');
	if (!toggle || !links) return;
	toggle.addEventListener('click', () => {
		const isOpen = links.classList.toggle('open');
		toggle.setAttribute('aria-expanded', String(isOpen));
	});
})();

// Chatbot
(function () {
	const bubble = document.querySelector('.chatbot-bubble');
	const windowEl = document.querySelector('.chatbot-window');
	const closeBtn = document.querySelector('.chatbot-close');
	const form = document.querySelector('.chatbot-input');
	const input = document.getElementById('chat-input');
	const messages = document.querySelector('.chatbot-messages');

	if (!bubble || !windowEl || !form || !input || !messages) return;

	const KEYWORD_RESPONSES = [
		{ key: 'hello', reply: 'Hello! 👋 Glad to see you back. If you’d like to submit another request, type restart.' },
		{ key: 'offers', reply: 'We have seasonal offers coming soon. Stay tuned on the Explore page!' },
		{ key: 'contact', reply: 'You can reach us via the Contact page form. We usually reply within 24–48 hours.' }
	];

	const STEP_PROMPTS = {
		name: 'To help you better, can I have your name?',
		contact: 'Thanks! What’s the best contact number for you?',
		email: 'Great. Could you share your email address?',
		query: 'Awesome. What can we help you with today?'
	};

	let conversation = {
		step: 'idle',
		data: {}
	};

	function addMessage(text, sender = 'bot') {
		const el = document.createElement('div');
		el.className = `msg ${sender}`;
		el.textContent = text;
		messages.appendChild(el);
		messages.scrollTop = messages.scrollHeight;
	}

	function startFlow() {
		conversation = { step: 'name', data: {} };
		addMessage(STEP_PROMPTS.name, 'bot');
	}

	function resetFlow() {
		addMessage('No problem—let’s start over.', 'bot');
		startFlow();
	}

	function openChat() {
		windowEl.classList.add('open');
		addGreetingOnce();
	}
	function closeChat() {
		windowEl.classList.remove('open');
	}

	let greeted = false;
	function addGreetingOnce() {
		if (greeted) return;
		addMessage('Hi there 👋! I’m the UrbanEase assistant.', 'bot');
		addMessage('I’d love to get a few details so we can tailor our response.', 'bot');
		startFlow();
		greeted = true;
	}

	bubble.addEventListener('click', () => {
		if (windowEl.classList.contains('open')) {
			closeChat();
		} else {
			openChat();
		}
	});
	if (closeBtn) closeBtn.addEventListener('click', closeChat);

	const responses = [
		{ key: 'hello', reply: 'Hello! 👋 How can I assist you today?' },
		{ key: 'help', reply: 'Sure! You can explore Restaurants, Fitness, and Salons. Ask me about offers or how to contact us.' },
		{ key: 'offers', reply: 'We have seasonal offers coming soon. Stay tuned on the Explore page!' },
		{ key: 'contact', reply: 'You can reach us via the Contact page form. We usually reply within 24–48 hours.' }
	];

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const text = input.value.trim();
		if (!text) return;
		addMessage(text, 'user');
		input.value = '';

		const normalized = text.toLowerCase();
		if (normalized === 'restart') {
			resetFlow();
			return;
		}

		if (conversation.step === 'idle') {
			startFlow();
			return;
		}

		switch (conversation.step) {
			case 'name': {
				const name = text.replace(/[^a-zA-Z\s'-]/g, '').trim();
				if (!name) {
					addMessage('Could you share the name we should address you with?', 'bot');
					return;
				}
				conversation.data.name = name;
				conversation.step = 'contact';
				addMessage(`Nice to meet you, ${name}! ${STEP_PROMPTS.contact}`, 'bot');
				break;
			}
			case 'contact': {
				const contact = text.replace(/[^\d+\-\s]/g, '').trim();
				if (contact.length < 6) {
					addMessage('That contact number seems short. Could you type it again?', 'bot');
					return;
				}
				conversation.data.contact = contact;
				conversation.step = 'email';
				addMessage(STEP_PROMPTS.email, 'bot');
				break;
			}
			case 'email': {
				const email = text.trim();
				const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailPattern.test(email)) {
					addMessage('That doesn’t look like a valid email. Could you double-check it?', 'bot');
					return;
				}
				conversation.data.email = email;
				conversation.step = 'query';
				addMessage(STEP_PROMPTS.query, 'bot');
				break;
			}
			case 'query': {
				conversation.data.query = text;
				const { name, contact, email } = conversation.data;
				addMessage(`Thanks ${name}! We’ll reach out at ${email} or ${contact} about "${text}".`, 'bot');
				addMessage('Our team typically replies within 24–48 hours. Type restart if you want to send another request.', 'bot');
				conversation.step = 'complete';
				break;
			}
			case 'complete': {
				const match = KEYWORD_RESPONSES.find(r => normalized.includes(r.key));
				if (match) {
					addMessage(match.reply, 'bot');
				} else {
					addMessage('Need to share another request? Type restart to begin again, or visit the Contact page for more options.', 'bot');
				}
				break;
			}
			default:
				addMessage('Thanks for the note! If you’d like to start the support flow again, type restart.', 'bot');
		}
	});
})();


