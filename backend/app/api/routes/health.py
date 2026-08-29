from fastapi import APIRouter

route=APIRouter(tags=["Health"])
@route.get("/health")
def get_health():
    return {"status":"healthy","services":"JanaSahayi AI AP"}
    