from fastapi import APIRouter,HTTPException,Depends,status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import create_access_token,verify_password
from app.db.model import User
from app.db.session import get_db
from app.schemas.auth import TokenResponse

router=APIRouter(prefix="/auth",tags=["authentication"],)

@router.post("/login",response_model=TokenResponse)
def login(form_data:OAuth2PasswordRequestForm=Depends(),session:Session=Depends(get_db)):
    email=form_data.username.strip().lower()
    statement=select(User).where(User.email==email)
    user=session.scalar(statement)

    if user is None or not verify_password(form_data.password,user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="incorrect email or password ", headers={"WWW-Authenticate": "Bearer"})
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Account is inactive",)
    access_token=create_access_token(subject=str(user.id),role=user.role,)
    return {"access_token": access_token,"token_type": "bearer",}