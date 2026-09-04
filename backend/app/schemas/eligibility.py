from pydantic import BaseModel,ConfigDict,Field,model_validator
from typing import Self
from decimal import  Decimal

class EligibilityRuleBase(BaseModel):
    minimum_age:int|None=Field(ge=0,default=None,le=100)
    maximum_age:int|None = Field(ge=0,default=None,le=100)
    maximum_annual_income:Decimal|None = Field(ge=0,default=None,max_digits=12,decimal_places=2)
    required_district:str|None=Field(default=None,min_length=1,max_length=100)
    required_occupation:str|None=Field(default=None,min_length=1,max_length=100)

    model_config=ConfigDict(str_strip_whitespace=True)

    @model_validator(mode="after")
    def validate_age_range(self)->Self:
        if (self.minimum_age is  not None
         and self.maximum_age is not None 
         and self.minimum_age>self.maximum_age):
         raise  ValueError("minimum_age cannot be greater than maximum_age")
        return self

class EligibilityRuleCreate(EligibilityRuleBase):
    pass

class EligibilityRuleResponse(EligibilityRuleBase):
    id:int
    scheme_id:int

    model_config=ConfigDict(from_attributes=True,str_strip_whitespace=True)

class EligibiliyRuleUpdate(EligibilityRuleBase):
    pass