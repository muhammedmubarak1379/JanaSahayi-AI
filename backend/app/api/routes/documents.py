from fastapi import APIRouter,HTTPException,Depends,status
from sqlalchemy.orm import Session
from sqlalchemy import select,func

from app.api.dependencies.auth import require_admin
from app.db.session import get_db
from app.schemas.document import SchemeDocumentResponse,SchemeDocumentCreate
from app.db.model import Scheme, SchemeChunk,SchemeDocument,User
from app.services.chunking import split_text
from app.services.embedding import create_embedding

router=APIRouter(prefix="/schemes",tags=["Knowledge Documents"])

@router.post("/{scheme_id}/documents",response_model=SchemeDocumentResponse,status_code=status.HTTP_201_CREATED)
def create_scheme_document(scheme_id:int , document_data:SchemeDocumentCreate, admin:User=Depends(require_admin) , session:Session=Depends(get_db)):
    scheme=session.get(Scheme,scheme_id)
    
    if (scheme is None or not scheme.is_active):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="scheme not found")
    
    text_chunk=split_text(document_data.content)
    chunk_embedding:list[tuple[str,list[float]]]=[]

    for chunk_content in text_chunk:
        embedding=create_embedding(chunk_content)

        chunk_embedding.append((chunk_content,embedding))
    
    new_document=SchemeDocument(
        scheme_id=scheme_id,
        title=document_data.title,
        source_url=document_data.source_url,
        content=document_data.content,
    )
    session.add(new_document)
    session.flush()

    for chunk_index,(chunk_content,embedding) in enumerate(chunk_embedding):
        new_chunk=SchemeChunk(
            document_id=new_document.id,
            chunk_index=chunk_index,
            content=chunk_content,
            embedding=embedding,
        )
        session.add(new_chunk)
    session.commit()
    session.refresh(new_document)

    return {
         "id":new_document.id,
         "scheme_id":new_document.scheme_id,
         "title":new_document.title,
         "source_url":new_document.source_url,
         "is_active":new_document.is_active,
         "created_at":new_document.created_at,
         "chunk_count":len(chunk_embedding)
    }
@router.get(
    "/{scheme_id}/documents",
    response_model=list[SchemeDocumentResponse],
)
def list_scheme_documents(
    scheme_id: int,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_db),
):
    scheme = session.get(Scheme, scheme_id)

    if scheme is None or not scheme.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheme not found",
        )

    statement = (
        select(
            SchemeDocument,
            func.count(SchemeChunk.id).label("chunk_count"),
        )
        .outerjoin(
            SchemeChunk,
            SchemeChunk.document_id == SchemeDocument.id,
        )
        .where(SchemeDocument.scheme_id == scheme_id)
        .group_by(SchemeDocument.id)
        .order_by(SchemeDocument.id)
    )

    rows = session.execute(statement).all()

    return [
        {
            "id": document.id,
            "scheme_id": document.scheme_id,
            "title": document.title,
            "source_url": document.source_url,
            "is_active": document.is_active,
            "created_at": document.created_at,
            "chunk_count": chunk_count,
        }
        for document, chunk_count in rows
    ]


@router.delete(
    "/{scheme_id}/documents/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def deactivate_scheme_document(
    scheme_id: int,
    document_id: int,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_db),
):
    scheme = session.get(Scheme, scheme_id)

    if scheme is None or not scheme.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheme not found",
        )

    document = session.get(SchemeDocument, document_id)

    if document is None or document.scheme_id != scheme_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found for this scheme",
        )

    if document.is_active:
        document.is_active = False
        session.commit()