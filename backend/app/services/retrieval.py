from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.model import Scheme,SchemeChunk,SchemeDocument
from app.services.embedding import create_embedding

def search_similar_chunks(session:Session , question:str , limit:int=5):
    question_embedding=create_embedding(question)

    distance=SchemeChunk.embedding.cosine_distance(question_embedding)

    statement=select(SchemeChunk,SchemeDocument,Scheme,distance.label("distance")).join(
        SchemeDocument,SchemeChunk.document_id==SchemeDocument.id,).join(Scheme,SchemeDocument.scheme_id==Scheme.id).where(
            SchemeDocument.is_active.is_(True),Scheme.is_active.is_(True)).order_by(distance).limit(limit)
        
    return session.execute(statement).all()