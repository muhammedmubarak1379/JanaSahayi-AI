import httpx
from app.core.config import settings

def generate_answer(question:str,contexts:list[str])->str:
    context_text="\n\n".join(f" source {index + 1}:\n{content}" for index , content in enumerate(contexts))

    system_message = (
    "You are JanaSahayi, a citizen-support assistant. "
    "Answer only using the provided sources. "
    "If the sources do not contain the answer, say that "
    "the available information is insufficient. "
    "Do not invent government rules or requirements. "
    "Clearly state that demo information is not official guidance.")

    user_message=( f"Question:\n{question}\n\n"
        f"Sources:\n{context_text}")
    responce=httpx.post(f"{settings.OLLAMA_BASE_URL}/api/chat" ,json={"model":settings.LLM_MODEL, "messages":[{"role":"system","content":system_message},{
        "role":"user","content":user_message
    }],"stream":False,"options":{"temperature":0.2}},timeout=180.0)

    responce.raise_for_status()
    responce_data=responce.json()
    answer=responce_data["message"]["content"].strip()

    if not answer:
        raise ValueError("The language model returned an empty answer")
    return answer