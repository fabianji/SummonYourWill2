# Spiritual Universe MVP

Aplicación web que permite definir guías espirituales, registrar medios, habilidades y entradas de diario. El backend usa **FastAPI** con almacenamiento JSON y el frontend es **React (Vite)**, separando la lógica de datos en servicios reutilizables pensando en un futuro port a React Native.

## Requisitos previos
- Python 3.10+ (probado con 3.11)
- Node.js 18+ y npm
- Opcional: `virtualenv` o `python -m venv`

## Instalación de dependencias
### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
```

### Frontend
```bash
cd frontend
npm install
```

## Ejecutar en desarrollo
### Backend (modo recarga)
```bash
cd backend
source .venv/bin/activate  # activar entorno
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
La API queda en `http://localhost:8000` con documentación automática en `/docs`.

### Frontend (Vite dev server)
```bash
cd frontend
npm run dev -- --host --port 5173
```
La SPA quedará en `http://localhost:5173` y consumirá la API local.

## Ejecutar en producción
### Backend
Opción simple con Uvicorn (un worker):
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Para entornos más robustos: `gunicorn -k uvicorn.workers.UvicornWorker app.main:app -b 0.0.0.0:8000`.

### Frontend
Generar build estático y servirlo con cualquier servidor de archivos estáticos (Nginx, `serve`, etc.):
```bash
cd frontend
npm run build
npm install -g serve  # opcional
serve -s dist -l 4173
```
También puedes configurar el backend o un reverso como Nginx para servir `frontend/dist`.

## Estructura de carpetas
```
backend/
  app/
    main.py           # Entrada de FastAPI y registro de rutas
    schemas.py        # Modelos Pydantic
    routes/           # Endpoints CRUD por entidad
    db/json_storage.py# Persistencia simple en archivos JSON
frontend/
  src/
    components/       # Tarjetas y navegación reutilizable
    pages/            # Páginas (Home, Guides, Diary, Abilities, Media)
    services/api.js   # Cliente HTTP compartible con móvil
```

## Notas
- Los modelos incluyen `user_id` para facilitar multiusuario en el futuro.
- La lógica de datos vive en `src/services` para reuso en una app móvil.
- Estilos simples con CSS para facilitar personalización posterior.
