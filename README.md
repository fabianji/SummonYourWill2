# Spiritual Universe MVP

Proyecto inicial con backend en FastAPI y frontend en React (Vite). La lógica de datos vive en servicios para poder reutilizarla en futuras apps móviles.

## Backend

### Requisitos
- Python 3.11+
- Instalar dependencias:
  ```bash
  cd backend
  pip install -r requirements.txt
  ```

### Ejecutar
```bash
uvicorn app.main:app --reload --port 8000
```
La API expone los recursos `/guides` y `/diary` con CRUD básico y almacenamiento en archivos JSON dentro de `backend/data`.

## Frontend

### Requisitos
- Node.js 18+

### Ejecutar
```bash
cd frontend
npm install
npm run dev
```
El frontend utiliza React Router y servicios en `src/services/api.js` para llamar al backend. Configura `VITE_API_BASE` si el backend corre en un puerto distinto (por defecto `http://localhost:8000`).

## Estructura
- `backend/app`: código FastAPI (rutas, esquemas y almacenamiento JSON).
- `backend/data`: archivos JSON persistentes.
- `frontend/src/pages`: vistas principales (Home, Guides, Diary, GuideDetail).
- `frontend/src/components`: componentes reutilizables y formularios.
- `frontend/src/services`: capa de servicios para llamadas HTTP reutilizable en web o móvil.
