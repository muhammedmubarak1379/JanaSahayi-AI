from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencies.auth import require_admin
from app.db.model import Scheme, SchemeEligibilityRule, User
from app.db.session import get_db
from app.schemas.eligibility import EligibilityRuleCreate,EligibilityRuleResponse,EligibiliyRuleUpdate


router=APIRouter(prefix="/schemes",tags=["Eligibility"])

@router.post("/{scheme_id}/eligibility-rule",response_model=EligibilityRuleResponse,status_code=status.HTTP_201_CREATED)
def create_eligibility_rule(scheme_id:int, rule_data:EligibilityRuleCreate , admin:User=Depends(require_admin), session:Session=Depends(get_db)):
    scheme=session.get(Scheme,scheme_id)

    if scheme is None or not scheme.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="scheme not found")
    statement=select(SchemeEligibilityRule).where(SchemeEligibilityRule.scheme_id==scheme_id)
    existing=session.scalar(statement) 

    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Eligibility rule already exists for this scheme")
    new_rule=SchemeEligibilityRule(
        scheme_id=scheme_id,
        minimum_age=rule_data.minimum_age,
        maximum_age=rule_data.maximum_age,
        maximum_annual_income=rule_data.maximum_annual_income,
        required_district=rule_data.required_district,
        required_occupation=rule_data.required_occupation,
    )
    session.add(new_rule)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Eligibility rule already exists for this scheme")
    session.refresh(new_rule)
    return new_rule

@router.get("/{scheme_id}/eligibility-rule",response_model=EligibilityRuleResponse)
def get_eligibility_rule(scheme_id:int, session:Session=Depends(get_db)):
    scheme=session.get(Scheme,scheme_id)
    
    if scheme is None or not scheme.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Scheme not found")
    statement=select(SchemeEligibilityRule).where(SchemeEligibilityRule.scheme_id==scheme_id)
    rule=session.scalar(statement)

    if rule is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Eligibility rule not found")
    return rule

@router.put("/{scheme_id}/eligibility-rule",response_model=EligibilityRuleResponse)
def update_eligibility_rule(scheme_id:int,rule_data:EligibiliyRuleUpdate, session:Session=Depends(get_db), admin:User=Depends(require_admin)):
    scheme=session.get(Scheme,scheme_id)
    if scheme is None or not scheme.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="scheme not found")
    statement=select(SchemeEligibilityRule).where(SchemeEligibilityRule.scheme_id==scheme_id)
    rule=session.scalar(statement)

    if rule is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="eligibility not found")
    
    rule.minimum_age = rule_data.minimum_age
    rule.maximum_age = rule_data.maximum_age
    rule.maximum_annual_income = rule_data.maximum_annual_income
    rule.required_district = rule_data.required_district
    rule.required_occupation = rule_data.required_occupation

    session.commit()
    session.refresh(rule)

    return rule
