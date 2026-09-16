from pydantic import BaseModel,ConfigDict,Field
from datetime import datetime

class SchemeDocumentCreate(BaseModel):
    title:str=Field(min_length=1,max_length=300)
    source_url:str|None=Field(default=None,max_length=1000)
    content:str=Field(min_length=1)
    model_config=ConfigDict(str_strip_whitespace=True)

class SchemeDocumentResponse(BaseModel):
    id:int
    scheme_id:int
    title:str
    is_active:bool
    created_at:datetime
    chunk_count:int
    source_url:str|None
    model_config=ConfigDict(from_attributes=True)