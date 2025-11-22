import json
from pathlib import Path
from typing import Dict, List, Optional, TypeVar, Callable
from threading import Lock

from app.schemas import EntityType

T = TypeVar("T", bound=EntityType)


class JSONStorage:
    def __init__(self, filepath: Path):
        self.filepath = filepath
        self._lock = Lock()
        self.filepath.parent.mkdir(parents=True, exist_ok=True)
        if not self.filepath.exists():
            self._write([])

    def _read(self) -> List[Dict]:
        with self.filepath.open("r", encoding="utf-8") as f:
            return json.load(f)

    def _write(self, data: List[Dict]) -> None:
        with self.filepath.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)

    def list(self) -> List[Dict]:
        with self._lock:
            return self._read()

    def get(self, item_id: str) -> Optional[Dict]:
        with self._lock:
            return next((item for item in self._read() if item.get("id") == item_id), None)

    def create(self, item: T) -> Dict:
        with self._lock:
            data = self._read()
            data.append(item.dict())
            self._write(data)
            return item.dict()

    def update(self, item_id: str, updates: Dict) -> Optional[Dict]:
        with self._lock:
            data = self._read()
            for idx, item in enumerate(data):
                if item.get("id") == item_id:
                    data[idx] = {**item, **updates}
                    self._write(data)
                    return data[idx]
            return None

    def delete(self, item_id: str) -> bool:
        with self._lock:
            data = self._read()
            new_data = [item for item in data if item.get("id") != item_id]
            deleted = len(new_data) != len(data)
            if deleted:
                self._write(new_data)
            return deleted

    def filter(self, predicate: Callable[[Dict], bool]) -> List[Dict]:
        with self._lock:
            return [item for item in self._read() if predicate(item)]
