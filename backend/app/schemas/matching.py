from pydantic import BaseModel

class EligibilityMatchResponse(BaseModel):
    scheme_id:int
    scheme_name: str    
    possible_match:bool
    failed_reasons:list[str]