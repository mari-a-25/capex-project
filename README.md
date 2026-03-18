# capex-project

Proyecto Vite + React que consume Airtable.

## Configuración (para que funcione sin subir secretos)

1. Crea un archivo `.env` en la raíz (no se sube a GitHub).
2. Copia el contenido de `.env.example` y reemplaza los valores:
   - `AIRTABLE_PAT` / `BASE_ID` para scripts Node
   - `VITE_AIRTABLE_PAT` / `VITE_BASE_ID` para el frontend (Vite)

## Ejecutar el frontend

```bash
npm install
npm run dev
```

## Scripts (opcional)

Estos scripts usan `.env` vía `dotenv`:

- `node add_metrics.cjs`
- `node init_registration_tables.cjs`
- `node process_solicitudes.cjs`
- `node check.cjs`

> Nota: Si corres scripts que acceden a la API de metadata (`/meta`), tu PAT debe tener permisos adecuados.

