# Backend Setup

## 1. Installation
```bash
pip install -r requirements.txt
```

## 2. Configuration
Set your Google API key in Replit Secrets:
1. Click on **Tools** in the left sidebar
2. Select **Secrets**
3. Click **New Secret**
4. Enter Key: `GOOGLE_API_KEY`
5. Enter Value: Your actual Google API key
6. Click **Add Secret**

The key name must be exactly `GOOGLE_API_KEY`.

## 3. Run
```bash
uvicorn app:app --host 0.0.0.0 --port 3000
```

## Testing
Test the endpoint with curl:
```bash
curl -X POST http://localhost:3000/ask-teacher -H 'Content-Type: application/json' -d @tests/sample_request.json
```
