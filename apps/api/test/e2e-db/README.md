# E2E mutable: aislamiento y privilegios

Ejecutar desde la raíz mediante `pnpm.cmd test:e2e:mutable`. No ejecutar Jest o
el launcher directamente: necesitan el contexto generado por el preparador.

## Credenciales y TLS

- Configurar únicamente el proyecto E2E aprobado en `apps/api/.env.e2e.local`,
  siguiendo `.env.e2e.example`. No versionar ni mostrar sus valores.
- Usar `sslmode=verify-full` y definir `NODE_EXTRA_CA_CERTS` con la ruta del
  certificado CA descargado de Supabase **antes de iniciar Node**. Los modos
  heredados `require` y `verify-ca` se normalizan a `verify-full` en memoria.
- No desactivar la verificación TLS. El preparador no propaga
  `NODE_TLS_REJECT_UNAUTHORIZED`, `NODE_OPTIONS` ni `NO_COLOR` a sus hijos.
- El archivo local conserva la credencial del preparador. Las credenciales
  temporales no se escriben en archivos ni se transmiten a Playwright/Next.js.

## Dos identidades

1. El preparador usa `postgres` solamente en el proyecto E2E: valida el destino,
   crea el esquema y rol en una transacción, aplica migraciones y carga fixtures.
2. La API y Jest usan un rol con el nombre del esquema de esa ejecución. Tiene
   `USAGE` del esquema y CRUD de sus tablas de negocio, pero no propiedad ni
   permisos para modificar su estructura.
   `_prisma_migrations` es de solo lectura. El rol no puede crear bases o roles,
   replicar ni omitir RLS; su contraseña expira a las ocho horas.
3. La contraseña se deriva con HMAC-SHA256 de la credencial del preparador y la
   identidad de la ejecución. El launcher de confianza la deriva por separado y
   arranca el build de Nest en un proceso hijo con un entorno filtrado. Nest
   ignora `.env` en modo E2E. No cambiar credenciales durante una ejecución.
4. Las comprobaciones previas verifican los privilegios efectivos, ausencia de
   membresías y acceso denegado a `anon`/`authenticated`. Jest comprueba además
   la identidad SQL y operaciones CRUD reales sobre un registro de prueba.
5. La limpieza verifica las marcas del esquema **y** del rol. Elimina ambos
   en una transacción, exclusivamente para esa ejecución.

El rol SQL limita el acceso de la aplicación a la base; no constituye un sandbox
del sistema operativo para ejecutar código hostil. El preparador y launcher
siguen siendo componentes de confianza con acceso al archivo local.

## Fallos y recuperación

Una excepción ordinaria ejecuta la limpieza aunque fallen migraciones o pruebas.
Una terminación forzada del proceso o pérdida de conectividad puede dejar el rol
y esquema. No reutilizarlos ni ejecutar limpiezas por prefijo. Revisar primero
proyecto, nombre exacto y ambas marcas, y solicitar una recuperación explícita.
La caducidad de la contraseña no elimina los objetos ni termina sesiones abiertas.

## Validación y configuración externa

- Gate principal: `pnpm.cmd check`.
- Ciclo remoto: `pnpm.cmd test:e2e:mutable`, con servidores Playwright controlados.
- Verificar después que no quedan el esquema ni el rol de la ejecución.
- La advertencia VM Modules experimental se conserva: Jest/Prisma necesitan el
  flag en este conjunto de versiones; no se silencian las advertencias globalmente.
- Para un proyecto que solo usa NestJS/Prisma, revisar y desactivar Data API en
  Supabase Dashboard. Esto no lo cambia el runner.
- Los permisos del plugin de IA y el alcance/solo lectura del MCP son controles
  externos distintos de las credenciales PostgreSQL y de este runner.

Referencias: [Prisma y Supabase](https://supabase.com/docs/guides/database/prisma),
[TLS](https://supabase.com/docs/guides/database/connecting-to-postgres#ssl),
[seguridad MCP](https://supabase.com/docs/guides/ai-tools/mcp).
