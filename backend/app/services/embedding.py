import httpx
from app.core.config import settings

def create_embedding(text:str)->list[float]:
    clear_text=text.strip()

    if not clear_text:
        raise ValueError("Text cannot be empty")
    response=httpx.post(f"{settings.OLLAMA_BASE_URL}/api/embed",
        json={"model":settings.EMBEDDING_MODEL,"input":clear_text}, timeout=120.0,)
    
    response.raise_for_status()
    response_data=response.json()
    embedding=response_data["embeddings"][0]

    if len(embedding) != settings.EMBEDDING_DIMENSION:
        raise ValueError("Embedding dimension does not match the configured dimension")
    return embedding