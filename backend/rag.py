from sentence_transformers import SentenceTransformer
import chromadb
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("banking_docs")
model = SentenceTransformer("all-MiniLM-L6-v2")
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_answer(query: str, chat_history: list):
    query_embedding = model.encode(query).tolist()
    results = collection.query(query_embeddings=[query_embedding], n_results=3)
    context = "\n\n".join(results["documents"][0])
    messages = [{"role": "system", "content": f"You are a helpful banking assistant. Answer based only on this context:\n\n{context}"}]
    messages += chat_history
    messages.append({"role": "user", "content": query})
    response = groq_client.chat.completions.create(model="llama-3.3-70b-versatile", messages=messages)
    return response.choices[0].message.content