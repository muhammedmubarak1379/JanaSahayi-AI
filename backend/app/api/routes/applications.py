from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.api.dependencies.auth import get_current_user,require_admin
from app.db.model import Scheme, SchemeApplication, User
from app.db.session import get_db
from app.schemas.application import SchemeApplicationResponse,ApplicationStatusUpdate

router=APIRouter(prefix="/applications",tags=["Application"])

@router.post("/schemes/{scheme_id}", response_model=SchemeApplicationResponse,status_code=status.HTTP_201_CREATED)
def apply_for_scheme(scheme_id:int,current_user:User=Depends(get_current_user),session:Session=Depends(get_db)):
    if current_user.role != "citizen":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Only citizens can submit scheme applications")
    scheme=session.get(Scheme,scheme_id)

    if scheme is None or not scheme.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="scheme not found")
    existing_application=select(SchemeApplication).where(SchemeApplication.user_id==current_user.id,SchemeApplication.scheme_id==scheme_id)
    existing=session.scalar(existing_application)

    if existing is  not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="You have already applied for this scheme")
    
    new_application=SchemeApplication(user_id=current_user.id, scheme_id=scheme.id,)
    session.add(new_application)

    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="You have already applied for this scheme")
    session.refresh(new_application)
    return new_application

@router.get("/me",response_model=list[SchemeApplicationResponse],)
def get_my_application(current_id:User=Depends(get_current_user),session:Session=Depends(get_db)):
    scheme=select(SchemeApplication).where(SchemeApplication.user_id==current_id.id).order_by(SchemeApplication.id)
    application=session.scalars(scheme).all()
    return application

@router.patch("/{application_id}/status",response_model=SchemeApplicationResponse)
def application_update(application_id:int,status_data:ApplicationStatusUpdate,admin:User=Depends(require_admin),session:Session=Depends(get_db)):
    application=session.get(SchemeApplication,application_id)

    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="application not found")
    application.status=status_data.status
    session.commit() 
    session.refresh(application)
    return application

@router.get("",response_model=list[SchemeApplicationResponse])
def get_all_application(admin:User=Depends(require_admin),session:Session=Depends(get_db)):
    statement=select(SchemeApplication).order_by(SchemeApplication.id)
    application=session.scalars(statement).all()
    return application