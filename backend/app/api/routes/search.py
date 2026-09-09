from fastapi import APIRouter,HTTPException,Depends,Query,status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.search import SemanticSearchResponse
from app.services.retrieval import search_similar_chunks


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


 