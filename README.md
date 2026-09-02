# 🏦 Banking Support Chatbot

An AI-powered banking support chatbot built with **Retrieval-Augmented Generation (RAG)**. It answers customer queries by retrieving relevant context from a knowledge base of uploaded documents and generating grounded responses using a large language model.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://banking-chatbot-beta.vercel.app)

---

## 📖 Overview

Traditional rule-based banking chatbots struggle with open-ended questions. This project solves that by combining:

- **Semantic search** over your own documents (policies, FAQs, product sheets) using vector embeddings
- **A fast, open-weight LLM** (via Groq) to generate natural, context-aware responses
- A simple **upload → ask → answer** workflow, so the knowledge base can grow without retraining anything

---

## ✨ Features

- 💬 Conversational chat interface for banking-related queries
- 📄 Document upload — add new knowledge to the bot without code changes
- 🔍 Semantic retrieval via vector similarity search (not just keyword matching)
- ⚡ Fast inference using Groq's LLM API (`llama-3.3-70b-versatile`)
- 🔌 Simple REST API that's easy to extend or integrate elsewhere

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | FastAPI (Python) |
| Vector Database | ChromaDB |
| Embeddings | sentence-transformers |
| LLM | Groq (`llama-3.3-70b-versatile`) |

---

## 🏗️ Architecture

```
┌──────────┐      ┌──────────────────┐      ┌────────────┐      ┌────────────┐      ┌──────────┐
│   User   │─────▶│  React Frontend   │─────▶│   FastAPI   │─────▶│  ChromaDB   │      │  Groq LLM │
│          │◀─────│                    │◀─────│   Backend   │◀─────│ (similarity │─────▶│           │
└──────────┘      └──────────────────┘      └────────────┘      │  search)    │      └──────────┘
                                                                    └────────────┘
```

**Flow:**
1. User sends a message from the React chat UI.
2. FastAPI backend embeds the query and searches ChromaDB for the most relevant document chunks.
3. Retrieved context + the user's question are sent to the Groq LLM.
4. The generated answer is returned to the frontend and displayed to the user.

Uploaded documents follow a similar path: they're chunked, embedded with `sentence-transformers`, and stored in ChromaDB for future retrieval.

---

## 📂 Project Structure

```
banking-chatbot/
├── backend/            # FastAPI application
│   ├── main.py         # API entrypoint (routes: /health, /chat, /upload)
│   ├── requirements.txt
│   └── .env            # GROQ_API_KEY (not committed)
├── frontend/            # React application
│   ├── src/
│   ├── package.json
│   └── public/
├── venv/                # Local Python virtual environment (not committed)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.9+
- **Node.js** 16+ and npm
- A free **Groq API key** — get one at [console.groq.com](https://console.groq.com)

### 1. Clone the repository

```bash
git clone https://github.com/aniljoshi121/banking-chatbot.git
cd banking-chatbot
```

### 2. Backend setup

```bash
cd backend
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```
GROQ_API_KEY=your_groq_api_key_here
```

Run the backend server:

```bash
python -m uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### 3. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

---

## 🔑 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `GROQ_API_KEY` | `backend/.env` | API key for Groq's LLM inference API |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check — confirms the server is running |
| `POST` | `/chat` | Send a user message and receive a generated response |
| `POST` | `/upload` | Upload a document to add to the knowledge base |

### Example: `POST /chat`

**Request:**
```json
{
  "message": "What documents do I need to open a savings account?"
}
```

**Response:**
```json
{
  "response": "To open a savings account, you'll typically need a valid government-issued ID, proof of address, and your Social Security number or equivalent..."
}
```

### Example: `POST /upload`

Upload a document (e.g., PDF or text file) via `multipart/form-data`. The document is chunked, embedded, and stored in ChromaDB for retrieval in future chats.

---

## 🌍 Deployment

This project deploys as two separate services:

- **Frontend (React):** [Vercel](https://vercel.com) — free static hosting, connects directly to the `frontend/` directory
- **Backend (FastAPI):** [Render](https://render.com) — free web service instance
  - Root directory: `backend`
  - Build command: `pip install -r requirements.txt`
  - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
  - Environment variable: `GROQ_API_KEY`

> ⚠️ **Note:** Render's free tier does not provide persistent disk storage, so ChromaDB's local data resets on redeploys/restarts. For production use, consider a hosted vector store (e.g., Supabase/pgvector, Pinecone) instead of local ChromaDB.

Live demo: **[banking-chatbot-beta.vercel.app](https://banking-chatbot-beta.vercel.app)**

---

## 🗺️ Roadmap

- [ ] Persistent vector storage (Supabase/pgvector or Pinecone)
- [ ] Authentication for uploading documents
- [ ] Conversation history / multi-turn context
- [ ] Streaming responses
- [ ] Docker support for one-command local setup

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project does not currently specify a license. Consider adding one (e.g., MIT) to clarify usage rights for others.

---

## 👤 Author

**Anil Joshi**
GitHub: [@aniljoshi121](https://github.com/aniljoshi121)
