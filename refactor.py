import os
import re

directory = r'c:\Users\ak15g\Downloads\UrbanEase'
os.chdir(directory)

html_files = [
    'index.html', 'explore.html', 'cart.html', 'about.html', 'contact.html',
    'fitness.html', 'grooming.html', 'restaurants.html', 'salons.html', 'wellness.html'
]

og_tags = """
	<meta property="og:title" content="UrbanEase | Discover the smarter side of city living" />
	<meta property="og:description" content="Explore curated spots for food, fitness, and self-care." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://urbanease.com" />
	<meta property="og:image" content="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80" />
"""

for f in html_files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Add components.js before chatbot.js if not already there
    if '<script src="components.js"' not in content:
        content = content.replace('<script src="chatbot.js"', '<script src="components.js" defer></script>\n\t<script src="chatbot.js"')
    
    # Replace Header
    content = re.sub(r'<header class="site-header">.*?</header>', '<site-header></site-header>', content, flags=re.DOTALL)
    
    # Replace Footer
    content = re.sub(r'<footer class="site-footer">.*?</footer>', '<site-footer></site-footer>', content, flags=re.DOTALL)
    
    # Replace Chatbot
    content = re.sub(r'<div class="chatbot">.*?</div>', '<urban-chatbot></urban-chatbot>', content, flags=re.DOTALL)
    
    # Remove old year script
    content = re.sub(r'<script>\s*document\.getElementById\(\'year\'\)\.textContent\s*=\s*new Date\(\)\.getFullYear\(\);\s*</script>', '', content)

    # Insert OG tags before </head>
    if 'property="og:title"' not in content:
        content = content.replace('</head>', og_tags + '</head>')
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Refactored all HTML files.")
