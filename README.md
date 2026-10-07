# E-Commerce Advisor

An end-to-end shopping advisor with an original React interface and a FastAPI backend powered by a local Hugging Face Transformer. It helps users clarify needs, compare products, understand specifications, and make informed decisions without sales pressure.

## Architecture

```text
React + Vite frontend
        |
        v
FastAPI REST API (CORS enabled)
        |
        v
Temporary in-memory ConversationStore
        |
        v
Hugging Face Transformers + PyTorch
        |
        v
Generated advisor response
```

The default model is `HuggingFaceTB/SmolLM2-360M-Instruct`, a small instruction-following causal language model suitable for local development. The backend loads it once during application startup and reuses the tokenizer/model pipeline for each request. Inference uses `torch.inference_mode()` and automatically selects CUDA when available, otherwise CPU.

## Project structure

```text
ecommerce-advisor-chatbot/
├── frontend/
│   ├── src/api/chatbot.js
│   ├── src/components/
│   ├── src/App.jsx
│   ├── src/styles.css
│   └── package.json
├── backend/
│   ├── app/api/chat.py
│   ├── app/models/schemas.py
│   ├── app/services/chatbot.py
│   ├── app/services/conversation.py
│   ├── app/config.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── .gitignore
└── README.md
```

## Requirements

- Python 3.10+
- Node.js 18+
- npm
- A few GB of disk space for the first Hugging Face model download

## Run the backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:app --reload
```

The backend runs at `http://localhost:8000`. The first startup downloads the model configured by `MODEL_NAME`.

## Run the frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

To use another API URL, create `frontend/.env` with `VITE_API_URL=http://localhost:8000/api`.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `MODEL_NAME` | `HuggingFaceTB/SmolLM2-360M-Instruct` | Hugging Face causal language model |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin |
| `MAX_NEW_TOKENS` | `180` | Maximum generated tokens |
| `TEMPERATURE` | `0.7` | Sampling temperature |
| `TOP_P` | `0.9` | Nucleus sampling value |

## API

`GET /api/health` returns backend status and the configured model.

`POST /api/chat` accepts:

```json
{
  "conversation_id": "abc123",
  "messages": [
    { "role": "user", "content": "I need a laptop for programming under $1000." }
  ]
}
```

It returns the same conversation ID and an assistant message. The system-level E-Commerce Advisor instruction is added by the backend before generation and is not repeated in the visible chat.

## Temporary conversation storage

No database is required. The frontend keeps conversations in React state for the current browser session, while the backend also keeps the most recent messages in a process-memory dictionary. Both are intentionally temporary: browser refreshes reset the frontend state, and restarting the backend clears its memory. This is demonstration storage, not persistence.

## Limitations

The local model does not have live product inventory, live prices, web search, or current reviews. It can provide useful general guidance but may be less accurate or fluent than a larger hosted model. For production, connect a verified product catalog and add authentication, rate limits, observability, and persistent storage only if the product requires it. OpenAI ChatKit is not used.
