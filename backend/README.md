# Backend Setup

## 1. Installation
```bash
pip install -r requirements.txt
```

## 2. Configuration
Set your Google API key:
1. Create a .env file in backend folder
2. Paste your key there
GOOGLE_API_KEY=

## 3. Run
```bash
uvicorn app:app --host 0.0.0.0 --port 3000
```

## Testing
Test the endpoint with curl:
```bash
curl -X POST http://localhost:3000/ask-teacher -H 'Content-Type: application/json' -d @tests/sample_request.json
```
