from fastapi import APIRouter,HTTPException,Response,Query,Depends
from app.schemas.schemas import SchemaResponse,SchemeCreate,SchemeUpdate,SchemeListResponse
from sqlalchemy import select,func,or_
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.model import Scheme


router=APIRouter(prefix="/schemes",tags=["schemes"])

@router.get("", response_model=SchemeListResponse)
def get_schemes(
    session: Session = Depends(get_db),
    q: str | None = None,
    department: str | None = None,
    limit: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
        statement=select(Scheme).where(Scheme.is_active.is_(True))
        if q is not None:
            search_text = q.strip()

            if search_text:
                statement = statement.where(or_(
                    Scheme.name.icontains(search_text, autoescape=True),
                    Scheme.department.icontains(search_text, autoescape=True),
                    Scheme.description.icontains(search_text, autoescape=True),
                     Scheme.eligibility.icontains(search_text, autoescape=True),
                )
                )
        if department is not None:
            department_name = department.strip()

            if department_name:
                statement = statement.where(
                    Scheme.department == department_name
                )
        count_statement=select(func.count()).select_from(statement.subquery())
        total=session.scalar(count_statement)
        statement = (statement.order_by(Scheme.id).limit(limit).offset(offset))

        schemes = session.scalars(statement).all()
        return {"total":total,"limit":limit,"offset":offset,"items":schemes}

@router.get("/{scheme_id}",response_model=SchemaResponse)
def get_scheme(scheme_id:int,session:Session=Depends(get_db)):
    scheme=session.get(Scheme,scheme_id)
    if scheme is None or not scheme.is_active:
        raise HTTPException(status_code=404,detail="scheme not found")
        
    return scheme

@router.post("",response_model=SchemaResponse,status_code=201)
def create_schema(scheme_data:SchemeCreate,session:Session=Depends(get_db)):
        new_scheme=Scheme(
            name=scheme_data.name,
            department=scheme_data.department,
            description=scheme_data.description,
            eligibility=scheme_data.eligibility,
        )
        session.add(new_scheme)
        session.commit()
        session.refresh(new_scheme)

        return new_scheme

@router.put("/{scheme_id}",response_model=SchemaResponse)
def update_schema(scheme_id:int,scheme_data:SchemeUpdate,session: Session=Depends(get_db)):
        scheme=session.get(Scheme,scheme_id)

        if scheme is None:
            raise HTTPException(status_code=404,detail="scheme not found")
        scheme.name=scheme_data.name
        scheme.department=scheme_data.department
        scheme.description=scheme_data.description
        scheme.eligibility = scheme_data.eligibility

        session.commit()
        session.refresh(scheme)
        return scheme

@router.delete("/{scheme_id}",status_code=204)
def delete_scheme(scheme_id:int,session:Session=Depends(get_db)):
        scheme=session.get(Scheme,scheme_id)
        
        if scheme is None:
            raise HTTPException(status_code=404,detail="scheme not found")
        
        scheme.is_active = False
        session.commit()

        return Response(status_code=204)

