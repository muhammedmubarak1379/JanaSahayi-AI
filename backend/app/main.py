from fastapi import FastAPI
from app.api.routes import health,schemas
from app.api.routes.auth import router as auth_route

app=FastAPI(title="JanaSahayi AI")
app.include_router(health.router)
app.include_router(schemas.router)
app.include_router(auth_route)