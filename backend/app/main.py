from fastapi import FastAPI
from app.api.routes import health,schemas,profile,eligibility
from app.api.routes.auth import router as auth_route


app=FastAPI(title="JanaSahayi AI")
app.include_router(health.router)
app.include_router(schemas.router)
app.include_router(auth_route)
app.include_router(profile.router)
app.include_router(eligibility.router)