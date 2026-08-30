from fastapi import APIRouter
from app.schemas.schemas import SchemaResponse

router=APIRouter(prefix="/schemes",tags=["schemes"])

@router.get("", response_model=list[SchemaResponse])
def get_schemes():
    return [
        {
            "id": 1,
            "name": "Sample Employment Support Scheme",
            "department": "Sample Department",
            "description": "Temporary sample data used while building the API."
        }
    ]