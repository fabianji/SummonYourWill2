from datetime import datetime
from uuid import uuid4
from typing import List, Optional

from fastapi import APIRouter, HTTPException

from app.schemas import DiaryEntry, DiaryCreate, DiaryUpdate
from app.db import json_storage

router = APIRouter(prefix="/diary", tags=["diary"])
FILENAME = "diary_entries.json"


def _get_entries() -> List[DiaryEntry]:
    return [DiaryEntry(**item) for item in json_storage.load_entities(FILENAME)]


def _save_entries(entries: List[DiaryEntry]) -> None:
    json_storage.save_entities(FILENAME, [entry.model_dump() for entry in entries])


def _filter_entries(entry_type: Optional[str] = None, guide_id: Optional[str] = None) -> List[DiaryEntry]:
    entries = _get_entries()
    if entry_type:
        entries = [e for e in entries if e.entry_type == entry_type]
    if guide_id:
        entries = [e for e in entries if guide_id in e.guide_ids]
    return sorted(entries, key=lambda e: e.created_at, reverse=True)


@router.get("/", response_model=List[DiaryEntry])
def list_entries(entry_type: Optional[str] = None, guide_id: Optional[str] = None) -> List[DiaryEntry]:
    return _filter_entries(entry_type=entry_type, guide_id=guide_id)


@router.post("/", response_model=DiaryEntry, status_code=201)
def create_entry(entry: DiaryCreate) -> DiaryEntry:
    created_at = entry.created_at or datetime.utcnow()
    new_entry = DiaryEntry(id=str(uuid4()), created_at=created_at, **entry.model_dump(exclude={"created_at"}))
    entries = _get_entries()
    entries.append(new_entry)
    _save_entries(entries)
    return new_entry


@router.get("/{entry_id}", response_model=DiaryEntry)
def get_entry(entry_id: str) -> DiaryEntry:
    for entry in _get_entries():
        if entry.id == entry_id:
            return entry
    raise HTTPException(status_code=404, detail="Entry not found")


@router.put("/{entry_id}", response_model=DiaryEntry)
def update_entry(entry_id: str, payload: DiaryUpdate) -> DiaryEntry:
    entries = _get_entries()
    for idx, entry in enumerate(entries):
        if entry.id == entry_id:
            updated_data = entry.model_dump()
            updates = payload.model_dump(exclude_unset=True)
            if "created_at" in updates and isinstance(updates["created_at"], str):
                updates["created_at"] = datetime.fromisoformat(updates["created_at"])
            updated_data.update(updates)
            updated = DiaryEntry(**updated_data)
            entries[idx] = updated
            _save_entries(entries)
            return updated
    raise HTTPException(status_code=404, detail="Entry not found")


@router.delete("/{entry_id}", status_code=204)
def delete_entry(entry_id: str) -> None:
    entries = _get_entries()
    filtered = [entry for entry in entries if entry.id != entry_id]
    if len(filtered) == len(entries):
        raise HTTPException(status_code=404, detail="Entry not found")
    _save_entries(filtered)
