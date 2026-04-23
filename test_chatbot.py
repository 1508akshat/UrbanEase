import requests
import json

API_KEY = 'AIzaSyDSHJBRqncfuGmstbbzB8XznaS9UY8Z1RA'
URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}'

# This is what apiContents currently looks like after our fix:
# The welcome message was removed, so only the user message remains.
contents = [
    {
        "role": "user",
        "parts": [{"text": "hello"}]
    }
]

payload = {
    "systemInstruction": {
        "parts": [{"text": "You are the UrbanEase Assistant..."}]
    },
    "contents": contents
}

headers = {'Content-Type': 'application/json'}

response = requests.post(URL, json=payload, headers=headers)
print("Status Code:", response.status_code)
print("Response JSON:")
print(json.dumps(response.json(), indent=2))
