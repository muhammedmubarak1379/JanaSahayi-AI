from sqlalchemy import String,Text,Boolean,true,Date,ForeignKey,Numeric,CheckConstraint
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

class SchemeEligibilityRule(base):
    __tablename__="scheme_eligibility_rule"
    __table_args__=(CheckConstraint(
        "minimum_age IS NULL or maximum_age >=0",
        name="ck_eligibility_minimum_age_non_negative"
    ),CheckConstraint(
        "maximum_age IS NULL or maximum_age >=0",
        name="ck_eligibility_maximum_age_non_negative"
    ),CheckConstraint( """minimum_age IS NULL OR maximum_age IS NULL OR minimum_age <= maximum_age""",
        name="ck_eligibility_age_range",),
      CheckConstraint(" maximum_annual_income IS NULL OR maximum_annual_income >= 0",
          name="ck_eligibility_income_non_negative",),
        )
    id:Mapped[int]=mapped_column(primary_key=True)
    scheme_id:Mapped[int]=mapped_column(ForeignKey("scheme.id",ondelete="CASCADE"), unique=True, index=True,nullable=False)
    minimum_age:Mapped[int|None]=mapped_column(nullable=True)
    maximum_age:Mapped[int|None]=mapped_column(nullable=True)
    maximum_annual_income:Mapped[Decimal|None]=mapped_column(Numeric(12,2),nullable=True)
    required_district:Mapped[str|None]=mapped_column(String(100),nullable=True)
    required_occupation:Mapped[str|None]=mapped_column(String(100),nullable=True)