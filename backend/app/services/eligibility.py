from datetime import date
from app.db.model import CitizenProfile,SchemeEligibilityRule

def calculate_age(date_of_birth:date , today:date|None=None)->int:
    current_date=today or date.today()
    age=current_date.year-date_of_birth.year

    birthday_happend=(current_date.month,current_date.day)<(date_of_birth.month,date_of_birth.day)

    if birthday_happend:
        age -=1
    return age

def evaluate_eligibility(profile:CitizenProfile,rule:SchemeEligibilityRule)->tuple[bool,list[str]]:
    age=calculate_age(profile.date_of_birth)
    failed_reason:list[str]=[]
    if (rule.minimum_age is not None and age<rule.minimum_age):
        failed_reason.append(f"Minimum required age is : {rule.minimum_age}")
    if (rule.maximum_age is not None and age> rule.maximum_age):
        failed_reason.append(f"Maximum permitted age is {rule.maximum_age}")

    if (rule.maximum_annual_income is not None and profile.annual_income > rule.maximum_annual_income):
        failed_reason.append("Annual income is above the permitted limit")
    
    if (rule.required_district is not None and profile.district.strip().casefold() != rule.required_district.strip().casefold()):
        failed_reason.append(f"required district is {rule.required_district}")
    
    if (rule.required_occupation is not None and profile.occupation.strip().casefold() != rule.required_occupation.strip().casefold()):
        failed_reason.append(f"Required occupation is {rule.required_occupation}")

    is_eligible=len(failed_reason)==0

    return is_eligible,failed_reason
