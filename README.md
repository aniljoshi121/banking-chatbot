# Banking Support Chatbot

An AI-powered banking support chatbot using RAG (Retrieval-Augmented Generation).

## Tech Stack
- Frontend: React.js
- Backend: FastAPI (Python)
- Vector DB: ChromaDB
- Embeddings: sentence-transformers
- LLM: Groq (llama-3.3-70b-versatile)

## Setup Instructions

### Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
create .env file with GROQ_API_KEY=your_key
python -m uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm start

## Architecture
User → React Frontend → FastAPI Backend → ChromaDB (similarity search) → Groq LLM → Response

## API Endpoints
- GET  /health  - Check server status
- POST /chat    - Send a message
- POST /upload  - Upload a document