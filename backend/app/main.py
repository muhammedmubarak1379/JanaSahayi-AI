from fastapi import FastAPI
from app.api.routes import health

app=FastAPI(title="JanaSahayi AI")
app.include_router(health.route)