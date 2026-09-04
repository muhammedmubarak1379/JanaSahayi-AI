from sqlalchemy import String,Text,Boolean,true,Date,ForeignKey,Numeric
from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column
from datetime import date
from decimal import Decimal


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

class CitizenProfile(base):
    __tablename__="citizen_profile"
    id:Mapped[int]=mapped_column(primary_key=True)
    user_id:Mapped[int]=mapped_column(ForeignKey("user_account.id",ondelete="CASCADE"),index=True,unique=True,nullable=False)
    full_name:Mapped[str]=mapped_column(String(150),nullable=False)
    date_of_birth:Mapped[date]=mapped_column(Date,nullable=False)
    district:Mapped[str]=mapped_column(String(100),nullable=False)
    occupation:Mapped[str]=mapped_column(String(100),nullable=False)
    annual_income:Mapped[Decimal]=mapped_column(Numeric(12,2),nullable=False)