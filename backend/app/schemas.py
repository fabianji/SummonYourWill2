from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, validator


DEFAULT_USER_ID = "demo-user"


class GuideBase(BaseModel):
    user_id: str = DEFAULT_USER_ID
    name: str
    description: Optional[str] = None
    main_image_url: Optional[str] = None
    theme_color: Optional[str] = None
    domains: List[str] = Field(default_factory=list)


class GuideCreate(GuideBase):
    pass


class GuideUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    main_image_url: Optional[str] = None
    theme_color: Optional[str] = None
    domains: Optional[List[str]] = None


class Guide(GuideBase):
    id: str


class MediaItemBase(BaseModel):
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
        allowed = {"music", "image", "video"}
        if value not in allowed:
            raise ValueError(f"media_type must be one of {allowed}")
        return value


class MediaItemCreate(MediaItemBase):
    pass


class MediaItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    media_type: Optional[str] = None
    url: Optional[str] = None
    guide_ids: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    created_at: Optional[datetime] = None


class MediaItem(MediaItemBase):
    id: str


class AbilityBase(BaseModel):
    user_id: str = DEFAULT_USER_ID
    name: str
    description: str
    guide_ids: List[str] = Field(default_factory=list)
    image_urls: List[str] = Field(default_factory=list)
    main_media_id: Optional[str] = None
    unlocked_at: datetime = Field(default_factory=datetime.utcnow)


class AbilityCreate(AbilityBase):
    pass


class AbilityUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    guide_ids: Optional[List[str]] = None
    image_urls: Optional[List[str]] = None
    main_media_id: Optional[str] = None
    unlocked_at: Optional[datetime] = None


class Ability(AbilityBase):
    id: str


class DiaryEntryBase(BaseModel):
    user_id: str = DEFAULT_USER_ID
    title: str
    content: str
    entry_type: str
    guide_ids: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    mood_tags: List[str] = Field(default_factory=list)

    @validator("entry_type")
    def validate_entry_type(cls, value: str) -> str:
        allowed = {"personal", "single_guide", "multi_guide"}
        if value not in allowed:
            raise ValueError(f"entry_type must be one of {allowed}")
        return value


class DiaryEntryCreate(DiaryEntryBase):
    pass


class DiaryEntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    entry_type: Optional[str] = None
    guide_ids: Optional[List[str]] = None
    created_at: Optional[datetime] = None
    mood_tags: Optional[List[str]] = None


class DiaryEntry(DiaryEntryBase):
    id: str


EntityType = Guide | MediaItem | Ability | DiaryEntry
