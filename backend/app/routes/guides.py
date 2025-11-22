from fastapi import APIRouter, HTTPException
from uuid import uuid4
from typing import List

from app.schemas import Guide, GuideCreate, GuideUpdate
from app.db import json_storage

router = APIRouter(prefix="/guides", tags=["guides"])
FILENAME = "guides.json"


def _get_guides() -> List[Guide]:
    return [Guide(**item) for item in json_storage.load_entities(FILENAME)]


def _save_guides(guides: List[Guide]) -> None:
    json_storage.save_entities(FILENAME, [guide.model_dump() for guide in guides])


@router.get("/", response_model=List[Guide])
def list_guides() -> List[Guide]:
    return _get_guides()


@router.post("/", response_model=Guide, status_code=201)
def create_guide(guide: GuideCreate) -> Guide:
    new_guide = Guide(id=str(uuid4()), **guide.model_dump())
    guides = _get_guides()
    guides.append(new_guide)
    _save_guides(guides)
    return new_guide


@router.get("/{guide_id}", response_model=Guide)
def get_guide(guide_id: str) -> Guide:
    for guide in _get_guides():
        if guide.id == guide_id:
            return guide
    raise HTTPException(status_code=404, detail="Guide not found")


@router.put("/{guide_id}", response_model=Guide)
def update_guide(guide_id: str, payload: GuideUpdate) -> Guide:
    guides = _get_guides()
    for idx, guide in enumerate(guides):
        if guide.id == guide_id:
            updated_data = guide.model_dump()
            updates = payload.model_dump(exclude_unset=True)
            updated_data.update(updates)
            updated = Guide(**updated_data)
            guides[idx] = updated
            _save_guides(guides)
            return updated
    raise HTTPException(status_code=404, detail="Guide not found")


@router.delete("/{guide_id}", status_code=204)
def delete_guide(guide_id: str) -> None:
    guides = _get_guides()
    filtered = [guide for guide in guides if guide.id != guide_id]
    if len(filtered) == len(guides):
        raise HTTPException(status_code=404, detail="Guide not found")
    _save_guides(filtered)
