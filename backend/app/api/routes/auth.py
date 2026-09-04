from fastapi import APIRouter,HTTPException,Depends,status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core.security import create_access_token,verify_password,hash_password
from app.db.model import User
from app.db.session import get_db
from app.schemas.auth import TokenResponse,UserResponse
from app.api.dependencies.auth import get_current_user
from app.schemas.auth import TokenResponse,UserResponse,UserRegister


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

@router.post("/register",response_model=UserResponse,status_code=status.HTTP_201_CREATED)
def register_user(user_data:UserRegister,session:Session=Depends(get_db)):
    email=str(user_data.email).lower()
    statement=select(User).where(User.email==email)
    existing_user=session.scalar(statement)

    if existing_user is  not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="An account with this email already exists")
    new_user=User(email=email,hashed_password=hash_password(user_data.password),role="citizen")
    session.add(new_user)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="An account with this email already exists")
    session.refresh(new_user)
    return new_user






@router.get("/me",response_model=UserResponse)
def get_my_account(current_user:User=Depends(get_current_user)):
    return current_user