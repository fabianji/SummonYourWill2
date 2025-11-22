"""Pydantic schemas y validaciones para las entidades del dominio."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, validator


# ID de usuario por defecto para mantener soporte a futuro multiusuario.
DEFAULT_USER_ID = "demo-user"


class GuideBase(BaseModel):
    """Atributos compartidos por todas las operaciones sobre guías espirituales."""

    # Usuario propietario de la guía (permite futuro multiusuario).
    user_id: str = DEFAULT_USER_ID
    # Nombre visible de la guía espiritual.
    name: str
    # Descripción opcional para contextualizar a la guía.
    description: Optional[str] = None
    # URL de imagen principal que representa a la guía.
    main_image_url: Optional[str] = None
    # Color temático opcional usado por el cliente.
    theme_color: Optional[str] = None
    # Lista de dominios/temas asociados a la guía.
    domains: List[str] = Field(default_factory=list)


class GuideCreate(GuideBase):
    """Modelo para crear guías; reutiliza los mismos campos base."""

    pass


class GuideUpdate(BaseModel):
    """Modelo de actualización parcial de guías."""

    name: Optional[str] = None
    description: Optional[str] = None
    main_image_url: Optional[str] = None
    theme_color: Optional[str] = None
    domains: Optional[List[str]] = None


class Guide(GuideBase):
    """Modelo persistido de guía con identificador."""

    id: str


class MediaItemBase(BaseModel):
    """Atributos comunes para medios (música, imagen, video)."""

    user_id: str = DEFAULT_USER_ID
    title: str
    description: Optional[str] = None
    media_type: str
    url: str
    guide_ids: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @validator("media_type")
    def validate_media_type(cls, value: str) -> str:
        """Valida que el tipo de medio pertenezca al conjunto permitido."""

        allowed = {"music", "image", "video"}
        if value not in allowed:
            raise ValueError(f"media_type must be one of {allowed}")
        return value


class MediaItemCreate(MediaItemBase):
    """Modelo para creación de items de media."""

    pass


class MediaItemUpdate(BaseModel):
    """Modelo para actualización parcial de media."""

    title: Optional[str] = None
    description: Optional[str] = None
    media_type: Optional[str] = None
    url: Optional[str] = None
    guide_ids: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    created_at: Optional[datetime] = None


class MediaItem(MediaItemBase):
    """Modelo persistido de media con identificador."""

    id: str


class AbilityBase(BaseModel):
    """Atributos comunes para habilidades desbloqueadas."""

    user_id: str = DEFAULT_USER_ID
    name: str
    description: str
    guide_ids: List[str] = Field(default_factory=list)
    image_urls: List[str] = Field(default_factory=list)
    main_media_id: Optional[str] = None
    unlocked_at: datetime = Field(default_factory=datetime.utcnow)


class AbilityCreate(AbilityBase):
    """Modelo para creación de habilidades."""

    pass


class AbilityUpdate(BaseModel):
    """Modelo para actualización parcial de habilidades."""

    name: Optional[str] = None
    description: Optional[str] = None
    guide_ids: Optional[List[str]] = None
    image_urls: Optional[List[str]] = None
    main_media_id: Optional[str] = None
    unlocked_at: Optional[datetime] = None


class Ability(AbilityBase):
    """Modelo persistido de habilidad con identificador."""

    id: str


class DiaryEntryBase(BaseModel):
    """Campos comunes para entradas de diario."""

    user_id: str = DEFAULT_USER_ID
    title: str
    content: str
    entry_type: str
    guide_ids: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    mood_tags: List[str] = Field(default_factory=list)

    @validator("entry_type")
    def validate_entry_type(cls, value: str) -> str:
        """Restringe el tipo de entrada a los valores admitidos."""

        allowed = {"personal", "single_guide", "multi_guide"}
        if value not in allowed:
            raise ValueError(f"entry_type must be one of {allowed}")
        return value


class DiaryEntryCreate(DiaryEntryBase):
    """Modelo para creación de entradas de diario."""

    pass


class DiaryEntryUpdate(BaseModel):
    """Modelo para actualizar parcialmente entradas de diario."""

    title: Optional[str] = None
    content: Optional[str] = None
    entry_type: Optional[str] = None
    guide_ids: Optional[List[str]] = None
    created_at: Optional[datetime] = None
    mood_tags: Optional[List[str]] = None


class DiaryEntry(DiaryEntryBase):
    """Modelo persistido de entrada de diario con identificador."""

    id: str


# Tipo de unión para permitir tipado genérico en almacenamiento.
EntityType = Guide | MediaItem | Ability | DiaryEntry
