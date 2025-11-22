from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.json_storage import JSONStorage
from app.routes import guides, diary, media, abilities

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "db" / "data"

guide_storage = JSONStorage(DATA_DIR / "guides.json")
media_storage = JSONStorage(DATA_DIR / "media.json")
ability_storage = JSONStorage(DATA_DIR / "abilities.json")
diary_storage = JSONStorage(DATA_DIR / "diary_entries.json")

app = FastAPI(title="Spiritual Universe API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(guides.get_router(guide_storage))
app.include_router(media.get_router(media_storage))
app.include_router(abilities.get_router(ability_storage))
app.include_router(diary.get_router(diary_storage))


@app.get("/")
def read_root():
    return {"message": "Welcome to the Spiritual Universe API", "entities": ["guides", "media", "abilities", "diary"]}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
