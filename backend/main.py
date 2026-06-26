from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag import get_answer
from ingest import ingest_file
import shutil, os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://banking-chatbot-beta.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: list = []

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat")
def chat(req: ChatRequest):
    answer = get_answer(req.message, req.history)
    return {"response": answer}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    os.makedirs("data", exist_ok=True)
    path = f"data/{file.filename}"
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    chunks = ingest_file(path)
    return {"message": f"Uploaded and processed {chunks} chunks!"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)