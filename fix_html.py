import os

directory = r'c:\Users\ak15g\Downloads\UrbanEase'
os.chdir(directory)

html_files = [
    'index.html', 'explore.html', 'cart.html', 'about.html', 'contact.html',
    'fitness.html', 'grooming.html', 'restaurants.html', 'salons.html', 'wellness.html'
]

bad_html = """			<div class="chatbot-messages" aria-live="polite"></div>
			<form class="chatbot-input" autocomplete="off">
				<label class="sr-only" for="chat-input">Type your message</label>
				<input id="chat-input" type="text" name="message" placeholder="Type a message..." required />
				<button type="submit" class="btn btn-compact">Send</button>
			</form>
		</div>
	</div>"""

for f in html_files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace(bad_html, '')
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Fixed HTML files.")
