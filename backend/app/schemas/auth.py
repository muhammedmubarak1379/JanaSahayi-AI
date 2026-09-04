from pydantic import BaseModel,ConfigDict,EmailStr,Field

class TokenResponse(BaseModel):
    access_token:str
    token_type:str="bearer"

class UserResponse(BaseModel):
    id:int
    email:str
    role:str
    is_active:bool
    model_config=ConfigDict(from_attributes=True)

class UserRegister(BaseModel):
    email:EmailStr
    password:str=Field(min_length=12,max_length=128)