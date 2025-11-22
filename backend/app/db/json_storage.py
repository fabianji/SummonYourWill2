"""Almacenamiento simple basado en archivos JSON con bloqueo básico."""

import json
from pathlib import Path
from typing import Dict, List, Optional, TypeVar, Callable
from threading import Lock

from app.schemas import EntityType

# Tipo genérico limitado a las entidades definidas en los esquemas.
T = TypeVar("T", bound=EntityType)


class JSONStorage:
    """Provee operaciones CRUD básicas sobre un archivo JSON."""

    def __init__(self, filepath: Path):
        # Ruta del archivo que actúa como base de datos ligera.
        self.filepath = filepath
        # Lock para hacer operaciones thread-safe en entornos simples.
        self._lock = Lock()
        # Asegura que la carpeta exista.
        self.filepath.parent.mkdir(parents=True, exist_ok=True)
        # Inicializa el archivo con una lista vacía si no existe.
        if not self.filepath.exists():
            self._write([])

    def _read(self) -> List[Dict]:
        """Lee y devuelve todos los registros del archivo."""

        with self.filepath.open("r", encoding="utf-8") as f:
            return json.load(f)

    def _write(self, data: List[Dict]) -> None:
        """Sobrescribe el archivo con los datos proporcionados."""

        with self.filepath.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)

    def list(self) -> List[Dict]:
        """Devuelve todos los registros disponibles."""

        with self._lock:
            return self._read()

    def get(self, item_id: str) -> Optional[Dict]:
        """Obtiene un registro por ID o None si no existe."""

        with self._lock:
            return next((item for item in self._read() if item.get("id") == item_id), None)

    def create(self, item: T) -> Dict:
        """Agrega un nuevo registro y lo persiste en disco."""

        with self._lock:
            data = self._read()
            data.append(item.dict())
            self._write(data)
            return item.dict()

    def update(self, item_id: str, updates: Dict) -> Optional[Dict]:
        """Actualiza campos de un registro específico."""

        with self._lock:
            data = self._read()
            for idx, item in enumerate(data):
                if item.get("id") == item_id:
                    data[idx] = {**item, **updates}
                    self._write(data)
                    return data[idx]
            return None

    def delete(self, item_id: str) -> bool:
        """Elimina un registro por ID y devuelve si ocurrió la eliminación."""

        with self._lock:
            data = self._read()
            new_data = [item for item in data if item.get("id") != item_id]
            deleted = len(new_data) != len(data)
            if deleted:
                self._write(new_data)
            return deleted

    def filter(self, predicate: Callable[[Dict], bool]) -> List[Dict]:
        """Filtra registros usando un predicado proporcionado."""

        with self._lock:
            return [item for item in self._read() if predicate(item)]
