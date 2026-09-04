from pydantic import BaseModel,ConfigDict,Field

class SchemaResponse(BaseModel):
    id:int
    name:str
    department:str
    description:str
    eligibility: str | None = None
    is_active:bool
    model_config=ConfigDict(from_attributes=True)

class SchemeCreate(BaseModel):
    name: str=Field(min_length=1,max_length=200)
    department: str=Field(min_length=1,max_length=200)
    description: str=Field(min_length=1)
    eligibility: str | None = Field(default=None,min_length=1,)
    model_config=ConfigDict(str_strip_whitespace=True)

class SchemeUpdate(BaseModel):
    name: str=Field(min_length=1,max_length=200)
    department: str=Field(min_length=1,max_length=200)
    description: str=Field(min_length=1)
    eligibility: str | None = Field(default=None,min_length=1,)
    model_config=ConfigDict(str_strip_whitespace=True)

class SchemeListResponse(BaseModel):
    total: int
    limit:int
    offset:int
    items: list[SchemaResponse]
