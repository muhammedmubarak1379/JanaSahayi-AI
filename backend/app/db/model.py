from sqlalchemy import String,Text,Boolean,true
from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column

class base(DeclarativeBase):
    pass

class Scheme(base):
    __tablename__="scheme"
    id: Mapped[int]=mapped_column(primary_key=True)
    name: Mapped[str]=mapped_column(String(200))
    department: Mapped[str]=mapped_column(String(200))
    description: Mapped[str]=mapped_column(Text)
    eligibility: Mapped[str | None] = mapped_column(Text,nullable=True,)
    is_active: Mapped[bool]=mapped_column(Boolean,default=True,server_default=true(),nullable=False,)

class User(base):
    __tablename__="user_account"
    
    id:Mapped[int]=mapped_column(primary_key=True,)
    email:Mapped[str]=mapped_column(String(320),unique=True,index=True,nullable=False,)
    hashed_password:Mapped[str]=mapped_column(String(255),nullable=False,)
    is_active:Mapped[bool]=mapped_column(default=True,server_default=true(),nullable=False,)
    role:Mapped[str]=mapped_column(String(20),default='citizen',server_default='citizen',nullable=False,)