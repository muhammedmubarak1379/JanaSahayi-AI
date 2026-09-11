from fastapi import FastAPI
from app.api.routes import health,schemas,profile,eligibility,matching,applications,documents,search
from app.api.routes.auth import router as auth_route
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI(title="JanaSahayi AI")
frontend_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",]

app.add_middleware(CORSMiddleware,allow_origins=frontend_origins,allow_credentials=True,allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(schemas.router)
app.include_router(auth_route)
app.include_router(profile.router)
app.include_router(eligibility.router)
app.include_router(matching.router)
app.include_router(applications.router)
app.include_router(documents.router)
app.include_router(search.router)