from uuid import uuid4
from fastapi import APIRouter, HTTPException

from app.db.json_storage import JSONStorage
from app.schemas import MediaItem, MediaItemCreate, MediaItemUpdate


def get_router(storage: JSONStorage) -> APIRouter:
    router = APIRouter(prefix="/media", tags=["media"])

    @router.get("/", response_model=list[MediaItem])
    def list_media(media_type: str | None = None, guide_id: str | None = None) -> list[MediaItem]:
        items = [MediaItem(**item) for item in storage.list()]
        if media_type:
            items = [item for item in items if item.media_type == media_type]
        if guide_id:
            items = [item for item in items if guide_id in item.guide_ids]
        return sorted(items, key=lambda m: m.created_at, reverse=True)

    @router.post("/", response_model=MediaItem, status_code=201)
    def create_media(payload: MediaItemCreate) -> MediaItem:
        item = MediaItem(id=str(uuid4()), **payload.dict())
        storage.create(item)
        return item

    @router.get("/{media_id}", response_model=MediaItem)
    def get_media(media_id: str) -> MediaItem:
        data = storage.get(media_id)
        if not data:
            raise HTTPException(status_code=404, detail="Media item not found")
        return MediaItem(**data)

    @router.put("/{media_id}", response_model=MediaItem)
    def update_media(media_id: str, payload: MediaItemUpdate) -> MediaItem:
        data = storage.get(media_id)
        if not data:
            raise HTTPException(status_code=404, detail="Media item not found")
        updates = {k: v for k, v in payload.dict().items() if v is not None}
        updated = storage.update(media_id, updates)
        return MediaItem(**updated)

    @router.delete("/{media_id}", status_code=204)
    def delete_media(media_id: str):
        deleted = storage.delete(media_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Media item not found")

    return router
