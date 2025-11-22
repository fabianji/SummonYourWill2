"""Endpoints CRUD para gestionar guías espirituales."""

from uuid import uuid4
from fastapi import APIRouter, HTTPException

from app.db.json_storage import JSONStorage
from app.schemas import Guide, GuideCreate, GuideUpdate


def get_router(storage: JSONStorage) -> APIRouter:
    """Construye un router con dependencias de almacenamiento inyectadas."""

    router = APIRouter(prefix="/guides", tags=["guides"])

    @router.get("/", response_model=list[Guide])
    def list_guides() -> list[Guide]:
        """Lista todas las guías guardadas para el usuario actual."""

        return [Guide(**guide) for guide in storage.list()]

    @router.post("/", response_model=Guide, status_code=201)
    def create_guide(payload: GuideCreate) -> Guide:
        """Crea una nueva guía generando un UUID y persistiéndolo."""

        guide = Guide(id=str(uuid4()), **payload.dict())
        storage.create(guide)
        return guide

    @router.get("/{guide_id}", response_model=Guide)
    def get_guide(guide_id: str) -> Guide:
        """Recupera una guía por su identificador o devuelve 404."""

        data = storage.get(guide_id)
        if not data:
            raise HTTPException(status_code=404, detail="Guide not found")
        return Guide(**data)

    @router.put("/{guide_id}", response_model=Guide)
    def update_guide(guide_id: str, payload: GuideUpdate) -> Guide:
        """Actualiza campos específicos de una guía existente."""

        data = storage.get(guide_id)
        if not data:
            raise HTTPException(status_code=404, detail="Guide not found")
        updated = storage.update(guide_id, {k: v for k, v in payload.dict().items() if v is not None})
        return Guide(**updated)

    @router.delete("/{guide_id}", status_code=204)
    def delete_guide(guide_id: str):
        """Elimina una guía y retorna 404 si no existe."""

        deleted = storage.delete(guide_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Guide not found")

    return router
