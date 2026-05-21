from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from sentence_transformers import SentenceTransformer
import chromadb, os

client = chromadb.PersistentClient(path="./chroma_db")
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