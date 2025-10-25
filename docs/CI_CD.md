# CI/CD con GitHub Actions y Fly.io

Este proyecto despliega automáticamente a Fly.io cuando haces push a `main`. En Pull Requests, ejecuta el pipeline de calidad (lint/build/test) sin desplegar.

## Workflow

Archivo: `.github/workflows/ci-cd.yml`

- CI (siempre):
  - `npm ci`
  - `npm run lint:check`
  - `npm run build`
  - `npm test -- --passWithNoTests`
- Deploy (solo push a `main`):
  - `flyctl deploy --remote-only`
  - Smoke test a `GET /api/gestion/health`

## Configuración requerida

1. En GitHub → Settings → Secrets and variables → Actions, crea el secret `FLY_API_TOKEN` con un token de API de Fly que tenga permisos para desplegar la app definida en `fly.toml`.
2. Ajusta secretos en Fly con `flyctl secrets set` (DB*\*, JWT*\*, etc.). Consulta `ENV_SETUP.md` para detalles.
3. (Opcional) Modifica la URL de salud si cambia el dominio (`HEALTH_URL` en el workflow).

## Notas

- El job de deploy usa `concurrency` para cancelar despliegues en curso del mismo branch.
- Las pruebas usan `--passWithNoTests` para no fallar si aún no hay tests.
- Si el smoke test devuelve un HTTP distinto de 200, el pipeline falla para evitar dejar un despliegue roto.
