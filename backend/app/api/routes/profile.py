from fastapi import APIRouter,HTTPException,Depends,status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.model import CitizenProfile,User
from app.db.session import get_db
from app.schemas.profile import CitizenProfileCreate,CitizenProfileResponse,CitizenProfileUpdte

router=APIRouter(prefix="/profile",tags=["Profile"])

@router.post("/me",response_model=CitizenProfileResponse,status_code=status.HTTP_201_CREATED)
def create_my_profile(profile_data:CitizenProfileCreate, current_user:User=Depends(get_current_user), session:Session=Depends(get_db)):
    statment=select(CitizenProfile).where(CitizenProfile.user_id==current_user.id)
    existing_profile=session.scalar(statment)

    if existing_profile is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Citizen profile already exists")
    new_profile=CitizenProfile(
        user_id=current_user.id,
        full_name=profile_data.full_name,
        date_of_birth=profile_data.date_of_birth,
        district=profile_data.district,
        occupation=profile_data.occupation,
        annual_income=profile_data.annual_income,
    )
    session.add(new_profile)
    
    try:
        session.commit()
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Citizen profile already exists")

    session.refresh(new_profile)
    return new_profile

@router.get("/me",response_model=CitizenProfileResponse,)
def get_my_profile(current_user:User=Depends(get_current_user), session:Session=Depends(get_db)):
    statement=select(CitizenProfile).where(CitizenProfile.user_id==current_user.id)
    profile=session.scalar(statement)

    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Citizen profile not found")
    return profile

@router.put("/me",response_model=CitizenProfileResponse)
def update_my_profile(profile_data:CitizenProfileUpdte, current_user:User=Depends(get_current_user), session:Session=Depends(get_db)):
    statement=select(CitizenProfile).where(CitizenProfile.user_id==current_user.id)
    profile=session.scalar(statement)
    
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Citizen profile not found")
    profile.full_name=profile_data.full_name
    profile.date_of_birth=profile_data.date_of_birth
    profile.district=profile_data.district
    profile.occupation=profile_data.occupation
    profile.annual_income=profile_data.annual_income

    session.commit()
    session.refresh(profile)

    return profile