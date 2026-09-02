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

