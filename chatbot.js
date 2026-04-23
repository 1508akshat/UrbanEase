// AI-Powered Chatbot with Persistence and Typing Indicator
(function () {
    // Poll to ensure the custom element has rendered its innerHTML
    function initChatbot() {
        const bubble = document.querySelector('.chatbot-bubble');
        const windowEl = document.querySelector('.chatbot-window');
        const closeBtn = document.querySelector('.chatbot-close');
        const form = document.querySelector('.chatbot-input');
        const input = document.getElementById('chat-input');
        const messages = document.querySelector('.chatbot-messages');

        if (!bubble || !windowEl || !form || !input || !messages) {
            setTimeout(initChatbot, 200);
            return;
        }

        // The backend serverless function securely holds the API key now.
        // We simply call our own Vercel API endpoint.
        const API_URL = '/api/chat';

        let chatHistory = [];

        try {
            const savedState = sessionStorage.getItem('urbanease_chatbot_ai');
            if (savedState) {
                chatHistory = JSON.parse(savedState);
            }
        } catch(e) {
            console.error('Could not load chat history', e);
        }

        function saveState() {
            sessionStorage.setItem('urbanease_chatbot_ai', JSON.stringify(chatHistory));
        }

        function renderMessage(text, sender) {
            const el = document.createElement('div');
            el.className = `msg ${sender}`;
            let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            el.innerHTML = formattedText;
            messages.appendChild(el);
            messages.scrollTop = messages.scrollHeight;
        }

        async function generateAIResponse() {
            const typing = document.createElement('div');
            typing.className = 'msg bot typing-indicator';
            typing.textContent = '...';
            messages.appendChild(typing);
            messages.scrollTop = messages.scrollHeight;

            try {
                // Ensure the payload strictly follows the required format
                // Gemini API requires the conversation to start with 'user'
                let apiContents = chatHistory.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.text }]
                }));

                // Remove the greeting from the model if it's the first message
                if (apiContents.length > 0 && apiContents[0].role === 'model') {
                    apiContents.shift();
                }

                const payload = {
                    systemInstruction: {
                        parts: [{ text: "You are the UrbanEase Assistant, a trendy and helpful concierge for a city discovery platform called UrbanEase. Keep your responses brief, friendly, and formatted nicely. Never mention that you are an AI. Use emojis." }]
                    },
                    contents: apiContents
                };

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                typing.remove();

                if (response.ok && data.candidates && data.candidates.length > 0) {
                    const botReply = data.candidates[0].content.parts[0].text;
                    chatHistory.push({ role: 'model', text: botReply });
                    saveState();
                    renderMessage(botReply, 'bot');
                } else {
                    console.error("API Error Response:", data);
                    renderMessage("I'm sorry, I couldn't process that right now. (API Error)", 'bot');
                }
            } catch (error) {
                console.error("AI Fetch Error:", error);
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

        // Render existing history
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

        if (closeBtn) {
            closeBtn.addEventListener('click', closeChat);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            chatHistory.push({ role: 'user', text });
            saveState();
            renderMessage(text, 'user');
            input.value = '';

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            
            await generateAIResponse();
            
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            input.focus();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})();
