from pydantic import BaseModel,ConfigDict
from datetime import datetime
from typing import Literal

class SchemeApplicationResponse(BaseModel):
    id:int
    user_id:int
    scheme_id:int
    status:Literal[ "pending","approved","rejected",]
    created_at:datetime

    model_config=ConfigDict(from_attributes=True)

class ApplicationStatusUpdate(BaseModel):
    status: Literal["approved","rejected",]