from fastapi import APIRouter

router=APIRouter(tags=["Health"])
@router.get("/health")
def get_health():
    return {"status":"healthy","services":"JanaSahayi AI AP"}
