"""Endpoints CRUD para entradas de diario con filtros básicos."""

from uuid import uuid4
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query

from app.db.json_storage import JSONStorage
from app.schemas import DiaryEntry, DiaryEntryCreate, DiaryEntryUpdate


def get_router(storage: JSONStorage) -> APIRouter:
    """Crea el router de diario inyectando la dependencia de almacenamiento."""

    router = APIRouter(prefix="/diary", tags=["diary"])

    @router.get("/", response_model=list[DiaryEntry])
    def list_entries(
        guide_id: str | None = None,
        start_date: datetime | None = Query(None, description="Filter entries from this date"),
        end_date: datetime | None = Query(None, description="Filter entries until this date"),
    ) -> list[DiaryEntry]:
        """Permite listar entradas con filtros por guía y rango de fechas."""

        entries = [DiaryEntry(**entry) for entry in storage.list()]
        if guide_id:
            entries = [entry for entry in entries if guide_id in entry.guide_ids]
        if start_date:
            entries = [entry for entry in entries if entry.created_at >= start_date]
        if end_date:
            entries = [entry for entry in entries if entry.created_at <= end_date]
        return sorted(entries, key=lambda e: e.created_at, reverse=True)

    @router.post("/", response_model=DiaryEntry, status_code=201)
    def create_entry(payload: DiaryEntryCreate) -> DiaryEntry:
        """Genera una nueva entrada asignando un UUID y guardándola."""

        entry = DiaryEntry(id=str(uuid4()), **payload.dict())
        storage.create(entry)
        return entry

    @router.get("/{entry_id}", response_model=DiaryEntry)
    def get_entry(entry_id: str) -> DiaryEntry:
        """Recupera una entrada por ID o responde 404 si no existe."""

        data = storage.get(entry_id)
        if not data:
            raise HTTPException(status_code=404, detail="Diary entry not found")
        return DiaryEntry(**data)

    @router.put("/{entry_id}", response_model=DiaryEntry)
    def update_entry(entry_id: str, payload: DiaryEntryUpdate) -> DiaryEntry:
        """Actualiza campos parciales de una entrada existente."""

        data = storage.get(entry_id)
        if not data:
            raise HTTPException(status_code=404, detail="Diary entry not found")
        updates = {k: v for k, v in payload.dict().items() if v is not None}
        updated = storage.update(entry_id, updates)
        return DiaryEntry(**updated)

    @router.delete("/{entry_id}", status_code=204)
    def delete_entry(entry_id: str):
        """Borra una entrada existente, devolviendo 404 si no se encuentra."""

        deleted = storage.delete(entry_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Diary entry not found")

    return router
