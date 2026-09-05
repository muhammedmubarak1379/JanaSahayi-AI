from fastapi import APIRouter,HTTPException,status,Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.api.dependencies.auth import get_current_user
from app.db.model import CitizenProfile,User,Scheme,SchemeEligibilityRule
from app.db.session import get_db
from app.schemas.matching import EligibilityMatchResponse
from app.services.eligibility import evaluate_eligibility

router=APIRouter(prefix="/matching",tags=["Matching"])

@router.get("/schemes/{scheme_id}",response_model=EligibilityMatchResponse)
def check_my_eligibility(scheme_id:int, session:Session=Depends(get_db), current_user:User=Depends(get_current_user)):
    statement=select(CitizenProfile).where(CitizenProfile.user_id==current_user.id)
    profile=session.scalar(statement)

    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Citizen profile not found. Create your profile first.")
    
    scheme=session.get(Scheme,scheme_id)
    
    if scheme is None or not scheme.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="scheme not found")
    
    rule_statement=select(SchemeEligibilityRule).where(SchemeEligibilityRule.scheme_id==scheme_id)
    rule=session.scalar(rule_statement)

    if rule is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Eligibility rule not found for this scheme")
    
    possible_match,failed_reason=evaluate_eligibility(profile,rule)
    return {
        "scheme_id": scheme.id,
        "scheme_name": scheme.name,
        "possible_match": possible_match,
        "failed_reasons": failed_reason,
    }
    
@router.get("/schemes",response_model=list[EligibilityMatchResponse])
def get_my_scheme_match(current_user:User=Depends(get_current_user), session:Session=Depends(get_db)):
    profile_statement=select(CitizenProfile).where(CitizenProfile.user_id==current_user.id)
    profile = session.scalar(profile_statement)

    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Citizen profile not found. Create your profile first")
    
    matches_statement=(select(Scheme,SchemeEligibilityRule).join(SchemeEligibilityRule,SchemeEligibilityRule.scheme_id==Scheme.id).where(
        Scheme.is_active.is_(True)).order_by(Scheme.id))
    scheme_row=session.execute(matches_statement).all()
    
    matches:list[dict]=[]

    for scheme , rule in scheme_row:
        possible_match,failed_reasons=evaluate_eligibility(profile,rule)
        matches.append(
            {
                "scheme_id": scheme.id,
                "scheme_name": scheme.name,
                "possible_match": possible_match,
                "failed_reasons": failed_reasons,
            }
        )
    return matches