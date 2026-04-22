class SiteHeader extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<header class="site-header">
				<nav class="navbar">
					<a href="index.html" class="logo">UrbanEase</a>
					<button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button>
					<ul class="nav-links">
						<li><a href="index.html" data-page="index.html">Home</a></li>
						<li><a href="explore.html" data-page="explore.html">Explore</a></li>
						<li><a href="cart.html" data-page="cart.html">My Cart <span class="cart-count-badge" data-cart-count>0</span></a></li>
						<li><a href="about.html" data-page="about.html">About</a></li>
						<li><a href="contact.html" data-page="contact.html">Contact</a></li>
					</ul>
					<div class="social-links" aria-label="Social and contact links">
						<a href="https://instagram.com/urbanease.lifestyle" target="_blank" rel="noopener noreferrer" title="Instagram: urbanease.lifestyle" aria-label="Instagram">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/>
								<circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.6"/>
								<circle cx="17.35" cy="6.65" r="1.2" fill="currentColor"/>
							</svg>
							<span class="sr-only">@urbanease.lifestyle</span>
						</a>
						<a href="https://x.com/AkshatGarg63055" target="_blank" rel="noopener noreferrer" title="X (Twitter): @AkshatGarg63055" aria-label="X (Twitter)">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path d="M6 5h3l3 4 3-4h3l-4.5 6L21 19h-3l-3.5-4.5L11 19H8l4.5-6L6 5z" fill="currentColor"/>
							</svg>
							<span class="sr-only">@AkshatGarg63055 on X</span>
						</a>
						<a href="mailto:gettheurbanease@gmail.com" title="Email: gettheurbanease@gmail.com" aria-label="Email">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" stroke-width="1.6"/>
								<path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
							<span class="sr-only">gettheurbanease@gmail.com</span>
						</a>
					</div>
				</nav>
			</header>
		`;

		// Set active link based on current path
		const currentPath = window.location.pathname.split('/').pop() || 'index.html';
		const links = this.querySelectorAll('.nav-links a');
		links.forEach(link => {
			// Exact match or active page
			if (link.getAttribute('data-page') === currentPath ||
				(currentPath.match(/(fitness|restaurants|salons|wellness|grooming)/) && link.getAttribute('data-page') === 'explore.html')) {
				link.classList.add('active');
			}
		});

		// Attach mobile nav toggle logic here since the element is dynamic
		const toggle = this.querySelector('.nav-toggle');
		const navLinks = this.querySelector('.nav-links');
		if (toggle && navLinks) {
			toggle.addEventListener('click', () => {
				const isOpen = navLinks.classList.toggle('open');
				toggle.setAttribute('aria-expanded', String(isOpen));
			});
		}
	}
}

class SiteFooter extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<footer class="site-footer">
				<p>© <span id="year"></span> UrbanEase • Discover the smarter side of city living</p>
			</footer>
		`;
		const yearEl = this.querySelector('#year');
		if (yearEl) {
			yearEl.textContent = new Date().getFullYear();
		}
	}
}

class UrbanChatbot extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div class="chatbot">
				<button class="chatbot-bubble" aria-label="Open chat">💬</button>
				<div class="chatbot-window" role="dialog" aria-modal="false" aria-labelledby="chatbot-title">
					<div class="chatbot-header">
						<strong id="chatbot-title">UrbanEase Assistant</strong>
						<button class="chatbot-close" aria-label="Close chat">×</button>
					</div>
					<div class="chatbot-messages" aria-live="polite"></div>
					<form class="chatbot-input" autocomplete="off">
						<label class="sr-only" for="chat-input">Type your message</label>
						<input id="chat-input" type="text" name="message" placeholder="Type a message..." required />
						<button type="submit" class="btn btn-compact">Send</button>
					</form>
				</div>
			</div>
		`;
	}
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);
customElements.define('urban-chatbot', UrbanChatbot);
