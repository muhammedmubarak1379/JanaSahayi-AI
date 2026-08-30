from pydantic import BaseModel

class SchemaResponse(BaseModel):
    id:int
    name:str
    department:str
    description:str