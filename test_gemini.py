import requests

API_KEY = 'AIzaSyDDMZbTBUaJ5CTGS0fCW8IiJSOQcAqNwjk'
URL = f'https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}'

response = requests.get(URL)
print("Status Code:", response.status_code)
for model in response.json().get('models', []):
    print(model['name'])
