from uuid import uuid4
from fastapi import APIRouter, HTTPException

from app.db.json_storage import JSONStorage
from app.schemas import Ability, AbilityCreate, AbilityUpdate


def get_router(storage: JSONStorage) -> APIRouter:
    router = APIRouter(prefix="/abilities", tags=["abilities"])

    @router.get("/", response_model=list[Ability])
    def list_abilities() -> list[Ability]:
        abilities = [Ability(**ability) for ability in storage.list()]
        return sorted(abilities, key=lambda a: a.unlocked_at, reverse=True)

    @router.post("/", response_model=Ability, status_code=201)
    def create_ability(payload: AbilityCreate) -> Ability:
        ability = Ability(id=str(uuid4()), **payload.dict())
        storage.create(ability)
        return ability

    @router.get("/{ability_id}", response_model=Ability)
    def get_ability(ability_id: str) -> Ability:
        data = storage.get(ability_id)
        if not data:
            raise HTTPException(status_code=404, detail="Ability not found")
        return Ability(**data)

    @router.put("/{ability_id}", response_model=Ability)
    def update_ability(ability_id: str, payload: AbilityUpdate) -> Ability:
        data = storage.get(ability_id)
        if not data:
            raise HTTPException(status_code=404, detail="Ability not found")
        updates = {k: v for k, v in payload.dict().items() if v is not None}
        updated = storage.update(ability_id, updates)
        return Ability(**updated)

    @router.delete("/{ability_id}", status_code=204)
    def delete_ability(ability_id: str):
        deleted = storage.delete(ability_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Ability not found")

    return router
