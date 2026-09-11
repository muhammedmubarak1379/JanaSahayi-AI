from fastapi import APIRouter,HTTPException,Depends,Query,status
from sqlalchemy.orm import Session
import httpx
from app.db.session import get_db
from app.schemas.search import SemanticSearchResponse
from app.services.retrieval import search_similar_chunks
from app.schemas.rag import KnowledgeQuestion,KnowledgeAnswerResponse
from app.services.generation import generate_answer


router=APIRouter(prefix="/knowledge",tags=["Knowledge Search"])

@router.get("/search",response_model=SemanticSearchResponse)
def sementic_search(question:str=Query(min_length=1),limit:int=Query(default=4,ge=1,le=10), session:Session=Depends(get_db)):
    clean_qusetion=question.strip()

    if not clean_qusetion:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,detail="question cannot be empty")
    rows=search_similar_chunks(session,clean_qusetion,limit)
    results=[]

    for chunk,document,scheme,distance in rows:
        results.append(
            {
                "scheme_id": scheme.id,
                "scheme_name": scheme.name,
                "document_id": document.id,
                "document_title": document.title,
                "source_url": document.source_url,
                "chunk_id": chunk.id,
                "content": chunk.content,
                "distance": float(distance),
            }
        )
    return{ "question": clean_qusetion,
         "results": results,}

@router.post("/ask",response_model=KnowledgeAnswerResponse,)
def ask_question(question_data:KnowledgeQuestion,session:Session=Depends(get_db),):
    try:
        rows=search_similar_chunks(session,question_data.question,limit=5,)
        if not rows:
            return {
                "question":question_data.question,
                "answer":"The available information is insufficient.",
                "sources": [],
            }

        best_chunk,best_document,best_scheme, best_distance = rows[0]
        if float(best_distance)>0.45:
            return {
                "question":question_data.question,
                "answer":"The available information is insufficient.",
                "sources": [],
            }

        contexts=[]

        for chunk,document,scheme,distance in rows:
            if document.id== best_document.id:
                contexts.append(chunk.content)
        answer= generate_answer(question_data.question,contexts,)
    except(httpx.HTTPError,ValueError):
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,detail="AI service is temporarily unavailable")
    sources=[{"scheme_name": best_scheme.name,"source_url": best_document.source_url,}]

    return {
        "question": question_data.question,
        "answer": answer,
        "sources": sources,
    }