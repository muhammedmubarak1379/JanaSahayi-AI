from datetime import date
from decimal import Decimal
from pydantic import BaseModel,ConfigDict,Field

class CitizenProfileBase(BaseModel):
    full_name:str=Field(min_length=1,max_length=150)
    date_of_birth:date
    district:str=Field(min_length=1,max_length=100)
    occupation:str=Field(min_length=1,max_length=100)
    annual_income:Decimal=Field(ge=0,max_digits=12,decimal_places=2)
    model_config=ConfigDict(str_strip_whitespace=True)

class CitizenProfileCreate(CitizenProfileBase):
    pass

class CitizenProfileResponse(CitizenProfileBase):
    id:int
    user_id:int
    model_config=ConfigDict(from_attributes=True,str_strip_whitespace=True)

class CitizenProfileUpdte(CitizenProfileBase):
    pass