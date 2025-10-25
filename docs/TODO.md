# TODO (Sistema)

- Validar configuración al arranque (StartupCheck) para JWT*\*, DB*\* y otros envs críticos; fallar rápido si falta algo o si los formatos son inválidos.
- No persistir la contraseña en claro en `IntentoAcceso`; enmascararla o eliminarla en producción.
- Agregar entorno de staging y despliegue de PRs en Fly.io.
- Añadir Husky + lint-staged para validaciones locales pre-commit.
