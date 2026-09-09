from pydantic import BaseModel

class SemanticSearchResult(BaseModel):
    scheme_id:int
    scheme_name:str
    document_id:int
    document_title:str
    source_url:str|None
    chunk_id:int
    content:str
    distance:float

class SemanticSearchResponse(BaseModel):
    question:str
    results:list[SemanticSearchResult]