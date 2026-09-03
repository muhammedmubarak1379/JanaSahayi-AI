from pwdlib import PasswordHash
from datetime import UTC,datetime,timedelta
import jwt
from app.core.config import settings

password_hash=PasswordHash.recommended()

def hash_password(password:str)-> str:
    return password_hash.hash(password)

def verify_password(plain_password:str,hashed_passord:str,)->bool:
    return password_hash.verify(plain_password,hashed_passord,)

def create_access_token(subject:str,role:str)->str:
    expires_at=datetime.now(UTC)+timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload={"sub":subject,"role":role,"exp":expires_at}
    return jwt.encode(payload,settings.JWT_SECRET_KEY.get_secret_value(),algorithm=settings.JWT_ALGORITHM)