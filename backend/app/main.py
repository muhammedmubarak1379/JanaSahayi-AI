from fastapi import FastAPI
from app.api.routes import health,schemas

app=FastAPI(title="JanaSahayi AI")
app.include_router(health.router)
app.include_router(schemas.router)