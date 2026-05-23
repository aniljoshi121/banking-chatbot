from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from sentence_transformers import SentenceTransformer
import chromadb, os

CHROMA_PATH = os.environ.get("CHROMA_PATH", "./chroma_db")

client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection("banking_docs")
model = SentenceTransformer("all-MiniLM-L6-v2")

def ingest_file(filepath: str):
    ext = os.path.splitext(filepath)[-1].lower()
    loader = PyPDFLoader(filepath) if ext == ".pdf" else TextLoader(filepath)
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)
    for i, chunk in enumerate(chunks):
        embedding = model.encode(chunk.page_content).tolist()
        collection.add(
            documents=[chunk.page_content],
            embeddings=[embedding],
            ids=[f"{os.path.basename(filepath)}_{i}"]
        )
    return len(chunks)

if __name__ == "__main__":
    data_dir = "data"
    if os.path.exists(data_dir):
        for filename in os.listdir(data_dir):
            if filename.endswith((".pdf", ".txt")):
                filepath = os.path.join(data_dir, filename)
                print(f"Ingesting {filename}...")
                count = ingest_file(filepath)
                print(f"  → {count} chunks added")
    print("Ingestion complete.")