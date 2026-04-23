import requests

API_KEY = 'AIzaSyDSHJBRqncfuGmstbbzB8XznaS9UY8Z1RA'
URL = f'https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}'

response = requests.get(URL)
print("Status Code:", response.status_code)
for model in response.json().get('models', []):
    print(model['name'])
