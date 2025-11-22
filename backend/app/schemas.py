from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

DEFAULT_USER_ID = "local_user"


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


class DiaryBase(BaseModel):
    user_id: str = DEFAULT_USER_ID
    title: str
    content: str
    entry_type: str
    guide_ids: List[str] = Field(default_factory=list)
    mood_tags: List[str] = Field(default_factory=list)


class DiaryCreate(DiaryBase):
    created_at: Optional[datetime] = None


class DiaryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    entry_type: Optional[str] = None
    guide_ids: Optional[List[str]] = None
    mood_tags: Optional[List[str]] = None
    created_at: Optional[datetime] = None


class DiaryEntry(DiaryBase):
    id: str
    created_at: datetime

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}
