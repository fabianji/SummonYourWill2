from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import guides, diary

app = FastAPI(title="Personal Spiritual Universe API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(guides.router)
app.include_router(diary.router)


@app.get("/")
async def root():
    return {"message": "Spiritual Universe API is running"}
