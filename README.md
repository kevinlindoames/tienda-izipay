# Tienda Izipay

Monorepo para una tienda ecommerce con frontend en **Next.js** y backend en **NestJS**.

El objetivo de este README es que una persona pueda:

1. preparar una PC nueva;
2. clonar el repositorio;
3. instalar el entorno con las versiones correctas;
4. ejecutar frontend y backend;
5. correr pruebas y builds;
6. continuar el desarrollo sin romper la reproducibilidad del proyecto;
7. entender qué partes están implementadas y cuáles forman parte de la arquitectura futura.

> **Gestor de paquetes obligatorio:** pnpm.<br>
> No usar npm, Yarn ni Bun para instalar dependencias o ejecutar scripts del proyecto.

---

## 1. Estado actual del proyecto

Actualmente el repositorio incluye:

- monorepo con pnpm Workspaces + Turborepo;
- frontend Next.js con App Router;
- backend NestJS;
- Home funcional;
- componentes reutilizables;
- diseño responsive;
- soporte de Reduced Motion;
- correcciones de hidratación;
- validaciones de contraste WCAG;
- pruebas unitarias del frontend;
- prueba unitaria del backend;
- pruebas E2E con Playwright;
- pruebas de accesibilidad con Axe;
- lint;
- typecheck;
- builds de frontend y backend;
- despliegue del frontend preparado para Vercel.

Estado de calidad comprobado durante la implementación:

```text
Frontend: 24 archivos de prueba / 68 tests
Backend:  1 suite / 1 test
Lint:     OK
Typecheck: OK
Build web: OK
Build API: OK
```

### Todavía no forman parte de la implementación productiva

Las siguientes capacidades pertenecen a fases posteriores:

- catálogo real conectado al backend;
- carrito persistente;
- checkout;
- panel administrativo;
- PostgreSQL;
- Prisma;
- autenticación administrativa;
- inventario real;
- pedidos;
- integración productiva con Izipay.

---

## 2. Arquitectura general

```text
tienda-izipay/
│
├── apps/
│   ├── web/                  # Frontend Next.js
│   └── api/                  # Backend NestJS
│
├── package.json              # Scripts raíz y versiones del workspace
├── pnpm-lock.yaml            # Único lockfile del monorepo
├── pnpm-workspace.yaml       # Definición del workspace
├── turbo.json                # Pipeline de Turborepo
├── .node-version             # Node local recomendado
├── .nvmrc                    # Node local recomendado
├── .prettierignore
├── .gitignore
└── README.md
```

### Responsabilidades

**`apps/web`**

- interfaz de la tienda;
- navegación;
- renderizado;
- experiencia de usuario;
- estado cliente;
- consumo futuro de la API.

**`apps/api`**

- lógica de negocio;
- validaciones de servidor;
- precios;
- inventario;
- pedidos;
- seguridad;
- acceso futuro a PostgreSQL;
- integración futura con Izipay.

> El frontend nunca debe convertirse en la fuente autoritativa de precio, stock, pedidos o pagos.

---

## 3. Stack y versiones

### Base actual

| Tecnología   |                               Versión |
| ------------ | ------------------------------------: |
| Node.js      | **24.19.0 LTS** para desarrollo local |
| pnpm         |                           **11.17.0** |
| Turborepo    |                            **2.10.7** |
| Next.js      |                           **16.2.12** |
| React        |                            **19.2.8** |
| React DOM    |                            **19.2.8** |
| TypeScript   |                             **6.0.3** |
| Tailwind CSS |                             **4.3.3** |
| NestJS       |                           **11.1.28** |
| NestJS CLI   |                           **11.0.24** |
| ESLint       |                            **9.39.5** |
| Motion       |                           **12.42.2** |

### Política de versiones

El desarrollo local utiliza:

```text
Node.js 24.19.0
pnpm    11.17.0
```

El repositorio mantiene:

```text
.node-version -> 24.19.0
.nvmrc        -> 24.19.0
```

El `package.json` raíz permite:

```json
{
  "engines": {
    "node": "24.x",
    "pnpm": "11.17.0"
  },
  "packageManager": "pnpm@11.17.0"
}
```

La diferencia es intencional:

- **local:** se recomienda exactamente Node `24.19.0`;
- **deploy:** se permite cualquier runtime compatible `24.x`, necesario para plataformas administradas como Vercel.

### Reglas de dependencias

- usar pnpm exclusivamente;
- conservar un único `pnpm-lock.yaml`;
- no borrar el lockfile para resolver problemas de instalación;
- no usar `latest`;
- no introducir `^` o `~` sin una decisión explícita del proyecto;
- ejecutar instalaciones reproducibles con `--frozen-lockfile`.

---

# 4. Setup rápido

Usar esta sección si Git, Node.js 24.19.0 y pnpm 11.17.0 ya están correctamente instalados.

```powershell
git clone https://github.com/kevinlindoames/tienda-izipay.git

Set-Location ".\tienda-izipay"

node --version
pnpm.cmd --version
git --version

pnpm.cmd install --frozen-lockfile
pnpm.cmd check

pnpm.cmd dev
```

Servicios locales esperados:

```text
Frontend: http://localhost:3000
API:      http://localhost:3001/api/v1/health
```

---

# 5. Setup completo en Windows

Las instrucciones están pensadas para PowerShell y contemplan tanto una PC normal como una PC corporativa sin permisos de administrador.

---

## 5.1 Instalar Git

### Opción estándar con WinGet

Comprobar que WinGet exista:

```powershell
winget --version
```

Instalar Git:

```powershell
winget install --id Git.Git -e --source winget
```

Cerrar y volver a abrir PowerShell.

Verificar:

```powershell
git --version
```

### Configurar identidad Git

```powershell
git config --global user.name "TU NOMBRE"
git config --global user.email "TU_CORREO"
```

Comprobar:

```powershell
git config --global user.name
git config --global user.email
```

> En un repositorio público se puede usar el correo `noreply` configurado en GitHub si se desea ocultar el correo personal.

### Si no hay permisos de administrador

Git for Windows también publica una edición Portable. En una PC corporativa se puede utilizar esa alternativa o solicitar la instalación a soporte.

---

## 5.2 Instalar Node.js 24.19.0

### Opción A — Instalador oficial MSI

Para Windows x64:

```powershell
$NodeVersion = "24.19.0"
$NodeInstaller = "$env:TEMP\node-v$NodeVersion-x64.msi"

Invoke-WebRequest `
    -Uri "https://nodejs.org/dist/v$NodeVersion/node-v$NodeVersion-x64.msi" `
    -OutFile $NodeInstaller

Start-Process `
    -FilePath "msiexec.exe" `
    -ArgumentList "/i `"$NodeInstaller`"" `
    -Wait

Remove-Item $NodeInstaller -Force
```

Después cerrar y volver a abrir PowerShell:

```powershell
node --version
```

Resultado esperado:

```text
v24.19.0
```

### Opción B — Node portable sin administrador

Si no se puede escribir en `C:\Program Files`, utilizar el ZIP oficial dentro del perfil del usuario:

```powershell
$NodeVersion = "24.19.0"
$NodeZip = "$env:TEMP\node-v$NodeVersion-win-x64.zip"
$ToolsDir = "$env:LOCALAPPDATA\Programs"
$NodeDir = "$ToolsDir\node-v$NodeVersion-win-x64"

New-Item `
    -ItemType Directory `
    -Force `
    -Path $ToolsDir |
Out-Null

Invoke-WebRequest `
    -Uri "https://nodejs.org/dist/v$NodeVersion/node-v$NodeVersion-win-x64.zip" `
    -OutFile $NodeZip

Expand-Archive `
    -Path $NodeZip `
    -DestinationPath $ToolsDir `
    -Force

Remove-Item $NodeZip -Force
```

Agregar Node al `PATH` del usuario:

```powershell
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")

$Entries = @(
    $UserPath -split ";" |
    Where-Object { $_ -ne "" }
)

if ($Entries -notcontains $NodeDir) {
    $NewUserPath = if ([string]::IsNullOrWhiteSpace($UserPath)) {
        $NodeDir
    }
    else {
        "$NodeDir;$UserPath"
    }

    [Environment]::SetEnvironmentVariable(
        "Path",
        $NewUserPath,
        "User"
    )
}

$env:Path = "$NodeDir;$env:Path"
```

Verificar:

```powershell
node --version
```

Resultado esperado:

```text
v24.19.0
```

---

## 5.3 Configurar Corepack y pnpm

Node.js 24 incluye Corepack.

Verificar:

```powershell
corepack --version
```

### Escenario A — PC con permisos suficientes

```powershell
corepack enable pnpm
corepack install -g pnpm@11.17.0
```

Verificar:

```powershell
pnpm.cmd --version
```

Resultado esperado:

```text
11.17.0
```

### Escenario B — `corepack enable pnpm` falla con `EPERM`

Error típico:

```text
EPERM: operation not permitted, open 'C:\Program Files\nodejs\pnpm'
```

Esto significa que Corepack está intentando crear el shim de pnpm dentro de una carpeta protegida.

No es necesario cambiar la `ExecutionPolicy` ni ejecutar PowerShell como administrador.

Crear un directorio de usuario para los shims:

```powershell
$CorepackBin = "$env:LOCALAPPDATA\corepack\bin"

New-Item `
    -ItemType Directory `
    -Force `
    -Path $CorepackBin |
Out-Null
```

Habilitar pnpm allí:

```powershell
corepack enable `
    --install-directory "$CorepackBin" `
    pnpm
```

Instalar la versión exacta:

```powershell
corepack install -g pnpm@11.17.0
```

Agregar el directorio al `PATH` del usuario:

```powershell
$UserPath = [Environment]::GetEnvironmentVariable(
    "Path",
    "User"
)

$Entries = @(
    $UserPath -split ";" |
    Where-Object { $_ -ne "" }
)

if ($Entries -notcontains $CorepackBin) {
    $NewUserPath = if ([string]::IsNullOrWhiteSpace($UserPath)) {
        $CorepackBin
    }
    else {
        "$CorepackBin;$UserPath"
    }

    [Environment]::SetEnvironmentVariable(
        "Path",
        $NewUserPath,
        "User"
    )
}

$env:Path = "$CorepackBin;$env:Path"
```

Comprobar:

```powershell
corepack --version
pnpm.cmd --version
where.exe pnpm
```

El objetivo es obtener:

```text
pnpm 11.17.0
```

y que `where.exe pnpm` apunte al directorio del usuario, no a un shim que Windows no pudo crear.

### Alternativa sin shims

Si todavía no se desea crear un shim, Corepack puede ejecutar pnpm directamente:

```powershell
corepack pnpm@11.17.0 --version
```

---

## 5.4 PowerShell con `ExecutionPolicy` restrictiva

En algunas PCs PowerShell bloquea `pnpm.ps1`.

En ese caso usar:

```powershell
pnpm.cmd --version
pnpm.cmd install --frozen-lockfile
pnpm.cmd dev
pnpm.cmd check
```

Este proyecto utiliza `pnpm.cmd` en la documentación de Windows para evitar depender de cambios globales en la política de ejecución.

---

# 6. Clonar el repositorio

Elegir una carpeta de trabajo:

```powershell
Set-Location "D:\"
```

Clonar:

```powershell
git clone https://github.com/kevinlindoames/tienda-izipay.git
```

Entrar al proyecto:

```powershell
Set-Location ".\tienda-izipay"
```

Comprobar:

```powershell
git remote -v
git branch --show-current
git status
```

La rama principal debe ser:

```text
main
```

---

# 7. Instalar dependencias

Siempre desde la raíz:

```powershell
pnpm.cmd install --frozen-lockfile
```

Resultado esperado:

```text
Scope: all 3 workspace projects
...
Done
```

No utilizar:

```text
npm install
npm ci
yarn
bun install
```

---

# 8. Verificación inicial después de clonar

Comprobar versiones:

```powershell
node --version
pnpm.cmd --version
git --version
```

Objetivo:

```text
Node.js: v24.19.0
pnpm:    11.17.0
```

Ejecutar la puerta de calidad principal:

```powershell
pnpm.cmd check
```

Actualmente `check` ejecuta:

```text
format:check
→ lint
→ typecheck
→ test
→ build
```

El setup se considera correcto cuando el comando termina sin errores.

---

# 9. Ejecutar el proyecto

## Todo el monorepo

```powershell
pnpm.cmd dev
```

## Solo frontend

```powershell
pnpm.cmd dev:web
```

Abrir:

```text
http://localhost:3000
```

## Solo backend

```powershell
pnpm.cmd dev:api
```

La API utiliza por defecto:

```text
Puerto: 3001
Prefijo: /api/v1
```

Health check:

```text
http://localhost:3001/api/v1/health
```

Respuesta actual:

```json
{
  "status": "ok",
  "service": "api"
}
```

El backend también acepta:

```text
PORT
```

como variable de entorno opcional.

---

# 10. Scripts disponibles

Ejecutar desde la raíz.

| Comando                  | Función                                               |
| ------------------------ | ----------------------------------------------------- |
| `pnpm.cmd dev`           | Levanta las aplicaciones en desarrollo mediante Turbo |
| `pnpm.cmd dev:web`       | Solo Next.js                                          |
| `pnpm.cmd dev:api`       | Solo NestJS                                           |
| `pnpm.cmd build`         | Build completo                                        |
| `pnpm.cmd build:web`     | Build del frontend                                    |
| `pnpm.cmd build:api`     | Build del backend                                     |
| `pnpm.cmd start:web`     | Ejecuta el build de Next.js                           |
| `pnpm.cmd start:api`     | Ejecuta el build de NestJS                            |
| `pnpm.cmd lint`          | ESLint del workspace                                  |
| `pnpm.cmd lint:fix`      | ESLint con correcciones automáticas                   |
| `pnpm.cmd typecheck`     | TypeScript sin emitir archivos                        |
| `pnpm.cmd test`          | Tests unitarios                                       |
| `pnpm.cmd test:coverage` | Tests con cobertura                                   |
| `pnpm.cmd test:e2e`      | Playwright E2E del frontend                           |
| `pnpm.cmd test:a11y`     | Axe/Playwright de accesibilidad                       |
| `pnpm.cmd format`        | Aplica Prettier                                       |
| `pnpm.cmd format:check`  | Verifica Prettier                                     |
| `pnpm.cmd check`         | Quality gate principal                                |
| `pnpm.cmd ci`            | Instalación reproducible + check + E2E                |

---

# 11. Pruebas

## Tests unitarios

Todo:

```powershell
pnpm.cmd test
```

Frontend:

```powershell
pnpm.cmd --filter web test
```

Backend:

```powershell
pnpm.cmd --filter api test
```

## Cobertura

```powershell
pnpm.cmd test:coverage
```

## Playwright en una PC nueva

Después de instalar las dependencias, instalar Chromium:

```powershell
pnpm.cmd --filter web exec playwright install chromium
```

Ejecutar E2E:

```powershell
pnpm.cmd test:e2e
```

Ejecutar accesibilidad:

```powershell
pnpm.cmd test:a11y
```

---

# 12. Quality gate antes de integrar cambios

La validación mínima es:

```powershell
pnpm.cmd check
git diff --check
git status
```

Para una validación más completa:

```powershell
pnpm.cmd install --frozen-lockfile
pnpm.cmd check
pnpm.cmd test:e2e
pnpm.cmd test:a11y
```

No crear un commit si la puerta de calidad tiene errores que no estén entendidos y justificados.

---

# 13. Build de producción

## Monorepo completo

```powershell
pnpm.cmd build
```

## Frontend

```powershell
pnpm.cmd build:web
```

## Backend

```powershell
pnpm.cmd build:api
```

Actualmente:

```text
web -> next build
api -> nest build
```

---

# 14. Archivos generados

`apps/web/next-env.d.ts` es generado por Next.js.

No debe editarse manualmente y está excluido del flujo de formato del proyecto.

El lockfile:

```text
pnpm-lock.yaml
```

también se excluye de Prettier y debe ser modificado únicamente por pnpm cuando cambien dependencias de forma intencional.

---

# 15. Variables de entorno y secretos

Actualmente:

- la Home del frontend puede arrancar sin variables obligatorias;
- el backend usa `PORT` de forma opcional.

Los secretos futuros nunca deben almacenarse en Git.

Ejemplos futuros:

```env
NEXT_PUBLIC_API_URL=
DATABASE_URL=
```

Cuando aparezcan variables obligatorias se debe mantener:

```text
.env.example
```

sin valores sensibles.

Nunca versionar:

- `.env`;
- `.env.local`;
- tokens;
- claves privadas;
- certificados privados;
- credenciales PostgreSQL;
- credenciales Izipay.

---

# 16. Estrategia de estado prevista

Esta sección describe la arquitectura objetivo. Algunas dependencias todavía se incorporarán cuando las funcionalidades correspondientes sean implementadas.

| Tipo de estado                            | Herramienta                 |
| ----------------------------------------- | --------------------------- |
| Contenido público / productos             | Server Components + `fetch` |
| Carrito                                   | Zustand                     |
| Borrador temporal del checkout            | Zustand                     |
| Inventario remoto                         | TanStack Query              |
| Pedidos / panel administrativo            | TanStack Query              |
| Formularios                               | React Hook Form + Zod       |
| Filtros / categorías / orden / paginación | `searchParams`              |
| Sesión administrativa                     | Cookies `HttpOnly`          |
| Precio / stock / pedidos / pagos          | NestJS + PostgreSQL         |

Principio:

```text
Estado visual temporal -> frontend
Dato de negocio autoritativo -> backend
```

---

# 17. Reglas de frontend

- App Router.
- Server Components por defecto.
- Client Components solo cuando exista una necesidad real de interacción.
- Mantener la frontera cliente lo más pequeña posible.
- Los componentes visuales no deben conocer PostgreSQL ni Izipay.
- No duplicar precio o stock como fuente autoritativa en el cliente.
- Mantener contenido/datos separados del JSX cuando corresponda.
- Respetar Reduced Motion.
- Mantener accesibilidad y contraste WCAG.
- Agregar tests con las funcionalidades nuevas.

---

# 18. Flujo Git

La rama de producción es:

```text
main
```

El frontend de Vercel está conectado a `main`, por lo que un push a esa rama puede generar un nuevo deployment.

## Antes de comenzar trabajo

```powershell
git checkout main
git pull origin main
git status
```

## Crear una rama

Ejemplo:

```powershell
git checkout -b feature/catalogo-productos
```

Convenciones sugeridas:

```text
feature/catalogo-productos
feature/carrito
feature/checkout
fix/header-mobile
```

## Antes del commit

```powershell
pnpm.cmd check
git diff --check
git status
```

## Conventional Commits

Usar mensajes como:

```text
feat: add product catalog
fix: correct mobile navigation
refactor: simplify product card
test: add checkout tests
docs: update development setup
chore: update tooling configuration
```

## Publicar la rama

```powershell
git push -u origin feature/nombre-funcionalidad
```

---

# 19. Continuar el trabajo desde otra PC

Si el repositorio ya existe en la computadora:

```powershell
Set-Location "RUTA\tienda-izipay"

git checkout main
git pull origin main

pnpm.cmd install --frozen-lockfile
pnpm.cmd check
```

Después crear o actualizar la rama de trabajo correspondiente.

---

# 20. Despliegue

## Frontend — Vercel

Configuración utilizada:

```text
Repository:     kevinlindoames/tienda-izipay
Production:     main
Framework:      Next.js
Root Directory: apps/web
```

Vercel detecta el monorepo y construye el frontend.

Durante el primer deployment apareció una incompatibilidad porque Vercel utilizó un Node 24.x distinto del patch local. Por eso `engines.node` se definió como:

```json
"node": "24.x"
```

mientras `.node-version` y `.nvmrc` conservan `24.19.0` para desarrollo.

## Backend

NestJS se versiona dentro del mismo monorepo, pero su despliegue será independiente.

La plataforma de backend, PostgreSQL e integración Izipay se definirán en su fase correspondiente.

---

# 21. Solución de problemas

## `ERR_PNPM_UNSUPPORTED_ENGINE`

```powershell
node --version
pnpm.cmd --version
```

Objetivo local:

```text
Node.js v24.19.0
pnpm   11.17.0
```

---

## `corepack enable pnpm` devuelve `EPERM`

Ejemplo:

```text
EPERM: operation not permitted, open 'C:\Program Files\nodejs\pnpm'
```

No modificar archivos dentro de `Program Files`.

Usar el procedimiento de la sección:

```text
5.3 -> Escenario B
```

con:

```powershell
corepack enable --install-directory "$env:LOCALAPPDATA\corepack\bin" pnpm
```

---

## PowerShell bloquea `pnpm.ps1`

Usar:

```powershell
pnpm.cmd
```

No es necesario cambiar la política global de ejecución.

---

## `pnpm format:check` falla con `next-env.d.ts`

`next-env.d.ts` es generado por Next.js y debe estar ignorado por Prettier.

Comprobar:

```powershell
Get-Content ".\.prettierignore"
```

Debe contener:

```text
apps/web/next-env.d.ts
pnpm-lock.yaml
```

---

## Instalación modifica inesperadamente el lockfile

```powershell
git status
git diff -- pnpm-lock.yaml
```

Si no hubo cambio intencional de dependencias, investigar antes de aceptar la modificación.

---

## Frontend no compila

```powershell
pnpm.cmd --filter web lint
pnpm.cmd --filter web typecheck
pnpm.cmd --filter web test
pnpm.cmd --filter web build
```

---

## Backend no compila

```powershell
pnpm.cmd --filter api lint
pnpm.cmd --filter api typecheck
pnpm.cmd --filter api test
pnpm.cmd --filter api build
```

---

## Puerto 3000 o 3001 ocupado

```powershell
Get-NetTCPConnection -State Listen |
Where-Object {
    $_.LocalPort -in 3000, 3001
} |
Select-Object `
    LocalAddress,
    LocalPort,
    OwningProcess
```

El backend permite cambiar su puerto mediante `PORT`.

---

# 22. Checklist de una PC nueva

Antes de comenzar a programar:

```text
[ ] Git instalado
[ ] Identidad Git configurada
[ ] Node.js v24.19.0
[ ] Corepack disponible
[ ] pnpm 11.17.0
[ ] Repositorio clonado
[ ] Rama main actualizada
[ ] pnpm install --frozen-lockfile finalizado
[ ] pnpm check finalizado
[ ] Chromium de Playwright instalado si se usarán E2E
[ ] Frontend abre en localhost:3000
[ ] API responde en localhost:3001/api/v1/health
```

---

# 23. Reglas críticas

1. Usar **pnpm exclusivamente**.
2. Mantener un único `pnpm-lock.yaml`.
3. Usar Node.js `24.19.0` en desarrollo salvo una decisión explícita de actualización.
4. No subir secretos.
5. Ejecutar `pnpm.cmd check` antes de integrar cambios.
6. Mantener Server Components por defecto en Next.js.
7. Mantener Client Components mínimos.
8. Mantener web y API desacoplados.
9. El backend es la autoridad de precio, stock, pedidos y pagos.
10. Izipay debe integrarse desde NestJS, no desde el navegador con secretos.
11. Agregar tests con cada funcionalidad relevante.
12. Mantener accesibilidad y Reduced Motion.
13. Mantener este README actualizado cuando cambie el setup.
14. Documentar cualquier nueva variable de entorno en `.env.example`.
15. No asumir que un comando funcionó: validar siempre su salida.

---

# 24. Referencias oficiales

- Node.js: https://nodejs.org/
- Archivo de releases de Node.js: https://nodejs.org/en/download/archive/v24
- Corepack: https://github.com/nodejs/corepack
- pnpm: https://pnpm.io/
- Git for Windows: https://git-scm.com/download/win
- Next.js: https://nextjs.org/docs
- NestJS: https://docs.nestjs.com/
- Turborepo: https://turborepo.com/docs
- Vercel: https://vercel.com/docs

---

## Resumen para volver a trabajar mañana

```powershell
Set-Location "RUTA\tienda-izipay"

git checkout main
git pull origin main

pnpm.cmd install --frozen-lockfile
pnpm.cmd check

git checkout -b feature/nueva-funcionalidad
pnpm.cmd dev
```

Con eso el entorno queda sincronizado, validado y listo para continuar el desarrollo.
