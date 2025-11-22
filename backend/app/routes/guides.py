from uuid import uuid4
from fastapi import APIRouter, HTTPException

from app.db.json_storage import JSONStorage
from app.schemas import Guide, GuideCreate, GuideUpdate


def get_router(storage: JSONStorage) -> APIRouter:
    router = APIRouter(prefix="/guides", tags=["guides"])

    @router.get("/", response_model=list[Guide])
    def list_guides() -> list[Guide]:
        return [Guide(**guide) for guide in storage.list()]

    @router.post("/", response_model=Guide, status_code=201)
    def create_guide(payload: GuideCreate) -> Guide:
        guide = Guide(id=str(uuid4()), **payload.dict())
        storage.create(guide)
        return guide

    @router.get("/{guide_id}", response_model=Guide)
    def get_guide(guide_id: str) -> Guide:
        data = storage.get(guide_id)
        if not data:
            raise HTTPException(status_code=404, detail="Guide not found")
        return Guide(**data)

    @router.put("/{guide_id}", response_model=Guide)
    def update_guide(guide_id: str, payload: GuideUpdate) -> Guide:
        data = storage.get(guide_id)
        if not data:
            raise HTTPException(status_code=404, detail="Guide not found")
        updated = storage.update(guide_id, {k: v for k, v in payload.dict().items() if v is not None})
        return Guide(**updated)

    @router.delete("/{guide_id}", status_code=204)
    def delete_guide(guide_id: str):
        deleted = storage.delete(guide_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Guide not found")

    return router
