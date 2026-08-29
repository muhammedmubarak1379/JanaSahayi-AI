from fastapi import FastAPI

app=FastAPI(title="JanaSahayi AI")
@app.get("/health")
def home():
    return {"status":"healthy","services":"janashayai AI API"}
