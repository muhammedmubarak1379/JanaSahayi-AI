from pydantic import BaseModel,ConfigDict,Field

class  KnowledgeQuestion(BaseModel):
    question:str=Field(min_length=1,max_length=1000)
    model_config=ConfigDict(str_strip_whitespace=True)

class KnowledgeSource(BaseModel):
    scheme_name:str
    source_url:str|None

class  KnowledgeAnswerResponse(BaseModel):
    question:str
    answer:str
    sources:list[KnowledgeSource]