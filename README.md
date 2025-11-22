# Spiritual Universe MVP

Proyecto inicial con **FastAPI** para el backend y **React (Vite)** para el frontend. La lógica de datos vive en servicios reutilizables para facilitar un futuro port a React Native / Expo.

## Estructura
- `backend/`: API REST con FastAPI y almacenamiento JSON por entidad.
  - `app/main.py`: inicializa la app y enruta guías, diario, media y habilidades.
  - `app/schemas.py`: modelos Pydantic listos para migrar a base de datos.
  - `app/routes/`: CRUD para cada recurso.
  - `app/db/json_storage.py`: persistencia simple en archivos JSON.
- `frontend/`: SPA React creada con Vite.
  - `src/services/api.js`: llamadas a la API, pensadas para ser compartidas con apps móviles.
  - `src/pages/`: vistas Home, Guides, Guide Detail, Diary, Abilities y Media.
  - `src/components/`: tarjetas y navegación reutilizable.

## Ejecutar backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

La API quedará disponible en `http://localhost:8000` con documentación automática en `/docs`.

## Ejecutar frontend

```bash
cd frontend
npm install
npm run dev
```

La app web quedará en `http://localhost:5173` consumiendo la API local.

## Notas para futuro móvil
- La lógica de llamadas a la API está aislada en `src/services/api.js` para poder reutilizarla en React Native.
- Los componentes son mayormente presentacionales; las pantallas manejan el estado y efectos de datos.
- El backend ya asume `user_id` en los modelos para facilitar multiusuario más adelante.
