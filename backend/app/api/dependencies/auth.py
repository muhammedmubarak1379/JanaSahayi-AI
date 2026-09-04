import jwt
from fastapi import HTTPException,Depends,status
from fastapi.security  import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.model import User
from app.db.session import get_db

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token:str=Depends(oauth2_scheme),session:Session=Depends(get_db))->User:

    credentials_exception=HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"},)
     
    try:
        payload=jwt.decode(token,settings.JWT_SECRET_KEY.get_secret_value(),algorithms=[settings.JWT_ALGORITHM])
        subject=payload.get("sub")

        if subject is None:
            raise credentials_exception
        user_id=int(subject)
    except(InvalidTokenError,TypeError,ValueError):
        raise credentials_exception
    user=session.get(User, user_id)
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Account is inactive",)
    return user

def require_admin(current_user:User=Depends(get_current_user))->User:
    if current_user.role !="admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Administrator access required",)
    return current_user