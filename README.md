# Tienda Izipay

Monorepo para una tienda ecommerce con frontend en **Next.js** y backend en **NestJS**. El proyecto utiliza **pnpm** como único gestor de paquetes y **Turborepo** para coordinar tareas del workspace.

> Este README está orientado a poder clonar el repositorio en otra computadora y dejar el ambiente de desarrollo listo de forma reproducible.

## 1. Stack actual

| Tecnología | Versión |
|---|---:|
| Node.js | 24.19.0 LTS recomendada para desarrollo |
| pnpm | 11.17.0 |
| Turborepo | 2.10.7 |
| Next.js | 16.2.12 |
| React / React DOM | 19.2.8 |
| TypeScript | 6.0.3 |
| Tailwind CSS | 4.3.3 |
| NestJS | 11.1.28 |
| NestJS CLI | 11.0.24 |
| ESLint | 9.39.5 |
| Motion | 12.42.2 |

### Política de versiones

- Para desarrollo local, usar **Node.js 24.19.0**. El repositorio incluye `.node-version` y `.nvmrc` con esa versión.
- `package.json` declara `node: 24.x` para permitir runtimes Node 24 administrados por plataformas de despliegue como Vercel.
- El proyecto fija `pnpm@11.17.0` en `package.json`.
- No usar npm, Yarn ni Bun para instalar o administrar dependencias del proyecto.
- No eliminar ni regenerar `pnpm-lock.yaml` salvo que un cambio de dependencias lo requiera expresamente.

---

## 2. Instalación de herramientas en Windows

Esta sección está pensada para una PC nueva. Si Git, Node.js y pnpm ya están instalados con las versiones correctas, se puede ir directamente a **Setup rápido**.

### 2.1 Verificar WinGet

```powershell
winget --version
```

### 2.2 Instalar Git

Instalación estándar con WinGet:

```powershell
winget install --id Git.Git -e --source winget
```

Cerrar y volver a abrir PowerShell y verificar:

```powershell
git --version
```

Configurar la identidad de Git:

```powershell
git config --global user.name "TU NOMBRE"
git config --global user.email "TU_CORREO"
```

Comprobar:

```powershell
git config --global user.name
git config --global user.email
```

> La instalación estándar de Git puede solicitar permisos de Windows. Si una PC corporativa no permite elevación, utilizar Git Portable o solicitar a soporte la instalación.

### 2.3 Instalar Node.js 24.19.0

El proyecto utiliza **Node.js 24.19.0 LTS** para desarrollo local.

#### Opción A — Instalador oficial

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

Cerrar y volver a abrir PowerShell y verificar:

```powershell
node --version
```

Resultado esperado:

```text
v24.19.0
```

> El instalador MSI puede solicitar permisos de administrador.

#### Opción B — Node.js portable sin permisos de administrador

```powershell
$NodeVersion = "24.19.0"
$NodeZip = "$env:TEMP\node-v$NodeVersion-win-x64.zip"
$ToolsDir = "$env:LOCALAPPDATA\Programs"
$NodeDir = "$ToolsDir\node-v$NodeVersion-win-x64"

New-Item -ItemType Directory -Force -Path $ToolsDir | Out-Null

Invoke-WebRequest `
  -Uri "https://nodejs.org/dist/v$NodeVersion/node-v$NodeVersion-win-x64.zip" `
  -OutFile $NodeZip

Expand-Archive `
  -Path $NodeZip `
  -DestinationPath $ToolsDir `
  -Force

Remove-Item $NodeZip -Force

$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($UserPath -notlike "*$NodeDir*") {
    [Environment]::SetEnvironmentVariable(
        "Path",
        "$NodeDir;$UserPath",
        "User"
    )
}

$env:Path = "$NodeDir;$env:Path"

node --version
```

Resultado esperado:

```text
v24.19.0
```

### 2.4 Habilitar Corepack e instalar pnpm 11.17.0

Verificar Corepack:

```powershell
corepack --version
```

Habilitar pnpm:

```powershell
corepack enable pnpm
```

Instalar y activar la versión exacta:

```powershell
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

Si PowerShell bloquea `pnpm.ps1`, utilizar siempre:

```powershell
pnpm.cmd --version
```

### 2.5 Resumen de instalación de herramientas

```powershell
winget install --id Git.Git -e --source winget
```

Instalar Node.js 24.19.0 con el bloque anterior y, después de reabrir PowerShell:

```powershell
node --version
git --version

corepack enable pnpm
corepack install -g pnpm@11.17.0

pnpm.cmd --version
```

Versiones esperadas:

```text
Node.js: v24.19.0
pnpm:    11.17.0
Git:     versión instalada disponible
```

---

## 3. Estructura del repositorio

```text
tienda-izipay/
├── apps/
│   ├── web/                 # Frontend Next.js
│   └── api/                 # Backend NestJS
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .node-version
├── .nvmrc
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
└── versiones-entorno.txt
```

### Aplicaciones

- `apps/web`: frontend de la tienda.
- `apps/api`: API NestJS.

---

## 4. Setup rápido

Si la nueva PC ya tiene Git, Node.js 24.19.0 y pnpm 11.17.0 configurados:

```powershell
git clone https://github.com/kevinlindoames/tienda-izipay.git
Set-Location .\tienda-izipay

node --version
pnpm.cmd --version

pnpm.cmd install --frozen-lockfile
pnpm.cmd check
pnpm.cmd dev
```

Después abrir:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:3001/api/v1/health
```

---

# 5. Setup completo en una PC Windows nueva

## Paso 1 — Instalar Git

Instalar una versión reciente de Git para Windows y comprobar:

```powershell
git --version
```

También conviene configurar la identidad de Git si la PC es nueva:

```powershell
git config --global user.name "TU NOMBRE"
git config --global user.email "TU_CORREO"
```

Verificar:

```powershell
git config --global user.name
git config --global user.email
```

> Si se desea mantener privado el correo personal en commits públicos, se puede usar el correo `noreply` configurado en GitHub.

## Paso 2 — Instalar Node.js 24.19.0 LTS

Instalar **Node.js 24.19.0 LTS**.

Comprobar:

```powershell
node --version
```

Resultado esperado:

```text
v24.19.0
```

El repositorio contiene:

```text
.node-version -> 24.19.0
.nvmrc        -> 24.19.0
```

Si se utiliza un administrador de versiones de Node, debe respetar estos archivos.

## Paso 3 — Habilitar pnpm con Corepack

Node 24 incluye Corepack. Verificar:

```powershell
corepack --version
```

Después habilitar los shims de pnpm:

```powershell
corepack enable pnpm
```

El repositorio fija la versión esperada mediante:

```json
"packageManager": "pnpm@11.17.0"
```

Una vez dentro del repositorio, comprobar:

```powershell
pnpm.cmd --version
```

Resultado esperado:

```text
11.17.0
```

### Si PowerShell bloquea `pnpm.ps1`

En equipos con `ExecutionPolicy` restrictiva, PowerShell puede intentar ejecutar `pnpm.ps1` y bloquearlo. En ese caso usar el ejecutable `.cmd`:

```powershell
pnpm.cmd --version
pnpm.cmd install --frozen-lockfile
pnpm.cmd dev
```

### Si `corepack enable pnpm` falla por permisos

Como alternativa temporal se puede ejecutar pnpm directamente mediante Corepack sin crear shims globales:

```powershell
corepack pnpm@11.17.0 --version
corepack pnpm@11.17.0 install --frozen-lockfile
```

---

# 6. Clonar el repositorio

Elegir una carpeta de trabajo y ejecutar:

```powershell
git clone https://github.com/kevinlindoames/tienda-izipay.git
Set-Location .\tienda-izipay
```

Verificar el origen y la rama:

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

Siempre ejecutar desde la raíz del monorepo:

```powershell
pnpm.cmd install --frozen-lockfile
```

Este comando utiliza el único `pnpm-lock.yaml` del workspace y garantiza que se instalen exactamente las dependencias registradas en el lockfile.

No hacer esto:

```text
npm install
npm ci
yarn
bun install
```

Tampoco borrar `pnpm-lock.yaml` para "arreglar" una instalación.

---

# 8. Validar el ambiente después de clonar

Comprobar herramientas:

```powershell
node --version
pnpm.cmd --version
git --version
```

Comprobar instalación reproducible:

```powershell
pnpm.cmd install --frozen-lockfile
```

Ejecutar la puerta de calidad principal:

```powershell
pnpm.cmd check
```

`pnpm check` ejecuta actualmente:

```text
format:check
lint
typecheck
test
build
```

Si todo termina sin errores, la instalación local está correctamente preparada para continuar el desarrollo.

---

# 9. Ejecutar el proyecto en desarrollo

## Frontend + backend

Desde la raíz:

```powershell
pnpm.cmd dev
```

Turborepo inicia las tareas `dev` de las aplicaciones del workspace.

## Solo frontend

```powershell
pnpm.cmd dev:web
```

URL por defecto:

```text
http://localhost:3000
```

## Solo backend

```powershell
pnpm.cmd dev:api
```

El backend usa por defecto el puerto `3001` y tiene prefijo global `/api/v1`.

Health check actual:

```text
http://localhost:3001/api/v1/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "api"
}
```

> Si se define la variable de entorno `PORT`, NestJS utilizará ese puerto en lugar de `3001`.

---

# 10. Scripts principales

Ejecutar los scripts desde la raíz del repositorio.

| Comando | Función |
|---|---|
| `pnpm.cmd dev` | Levanta el workspace en desarrollo |
| `pnpm.cmd dev:web` | Levanta solamente Next.js |
| `pnpm.cmd dev:api` | Levanta solamente NestJS |
| `pnpm.cmd build` | Build de todo el monorepo |
| `pnpm.cmd build:web` | Build del frontend |
| `pnpm.cmd build:api` | Build del backend |
| `pnpm.cmd lint` | ESLint del workspace |
| `pnpm.cmd lint:fix` | ESLint con autofix |
| `pnpm.cmd typecheck` | Verificación TypeScript |
| `pnpm.cmd test` | Pruebas unitarias |
| `pnpm.cmd test:coverage` | Pruebas con cobertura |
| `pnpm.cmd test:e2e` | Playwright E2E del frontend |
| `pnpm.cmd test:a11y` | Pruebas de accesibilidad |
| `pnpm.cmd format` | Aplica Prettier |
| `pnpm.cmd format:check` | Comprueba formato |
| `pnpm.cmd check` | Quality gate principal |
| `pnpm.cmd ci` | Instalación reproducible + check + E2E |

---

# 11. Pruebas E2E en una PC nueva

Playwright necesita un navegador instalado para ejecutar las pruebas E2E.

Después de instalar las dependencias del proyecto, instalar Chromium administrado por Playwright:

```powershell
pnpm.cmd --filter web exec playwright install chromium
```

Después ejecutar:

```powershell
pnpm.cmd test:e2e
```

Pruebas de accesibilidad:

```powershell
pnpm.cmd test:a11y
```

---

# 12. Build de producción

## Todo el monorepo

```powershell
pnpm.cmd build
```

## Solo frontend

```powershell
pnpm.cmd build:web
```

## Solo backend

```powershell
pnpm.cmd build:api
```

Actualmente el frontend utiliza Next.js 16 con Turbopack para el proceso de build.

---

# 13. Variables de entorno

Actualmente el frontend base puede arrancar sin variables de entorno obligatorias y el backend utiliza `PORT` solamente de forma opcional.

Los secretos futuros —por ejemplo credenciales de PostgreSQL, Izipay o servicios externos— **nunca deben subirse al repositorio**.

El `.gitignore` ya excluye:

```text
.env
.env.local
.env.*.local
```

Cuando el proyecto requiera variables obligatorias, se debe agregar y mantener un archivo versionado:

```text
.env.example
```

con únicamente nombres de variables y valores de ejemplo no sensibles.

Ejemplo futuro:

```env
# Ejemplo únicamente. No representa todavía variables obligatorias del proyecto.
NEXT_PUBLIC_API_URL=
DATABASE_URL=
```

---

# 14. Flujo recomendado para continuar el desarrollo

Antes de comenzar:

```powershell
Set-Location "RUTA\tienda-izipay"
git checkout main
git pull origin main
git status
```

Para una nueva funcionalidad se recomienda trabajar en una rama propia:

```powershell
git checkout -b feature/nombre-funcionalidad
```

Ejemplos:

```text
feature/catalogo-productos
feature/carrito
feature/checkout
fix/header-mobile
```

Antes de crear un commit:

```powershell
pnpm.cmd check
git diff --check
git status
```

Agregar cambios:

```powershell
git add .
```

Usar Conventional Commits:

```text
feat: agrega una funcionalidad
fix: corrige un defecto
refactor: reorganiza código sin cambiar comportamiento
test: agrega o corrige pruebas
docs: actualiza documentación
chore: mantenimiento técnico
```

Ejemplo:

```powershell
git commit -m "feat: add product catalog"
```

Subir la rama:

```powershell
git push -u origin feature/nombre-funcionalidad
```

---

# 15. Mantener una PC secundaria actualizada

Si el repositorio ya fue clonado anteriormente:

```powershell
Set-Location "RUTA\tienda-izipay"

git checkout main
git pull origin main
pnpm.cmd install --frozen-lockfile
pnpm.cmd check
```

Después crear o actualizar la rama de trabajo correspondiente.

Nunca continuar programando sobre una copia desactualizada sin ejecutar primero `git pull` en la rama base.

---

# 16. Despliegue actual

## Frontend

El frontend está preparado para Vercel con la siguiente configuración:

```text
Repositorio:      kevinlindoames/tienda-izipay
Rama producción: main
Framework:       Next.js
Root Directory:  apps/web
```

Vercel ejecuta el build del frontend dentro del monorepo.

## Backend

El backend NestJS se versiona en el mismo repositorio, pero su despliegue es independiente del frontend.

La plataforma de backend y la infraestructura de PostgreSQL/Izipay se configurarán en una etapa posterior.

---

# 16. Solución de problemas

## `ERR_PNPM_UNSUPPORTED_ENGINE`

Comprobar:

```powershell
node --version
pnpm.cmd --version
```

Para desarrollo local el objetivo es:

```text
Node.js v24.19.0
pnpm   11.17.0
```

## PowerShell dice que no se puede ejecutar `pnpm.ps1`

Usar:

```powershell
pnpm.cmd --version
pnpm.cmd install --frozen-lockfile
```

No es necesario cambiar la política global de ejecución solamente para trabajar con el proyecto.

## La instalación cambió el lockfile

Comprobar:

```powershell
git status
git diff -- pnpm-lock.yaml
```

Si no se modificaron dependencias intencionalmente, no se debe aceptar un cambio inesperado de `pnpm-lock.yaml`.

## El frontend no compila

Ejecutar por separado:

```powershell
pnpm.cmd --filter web lint
pnpm.cmd --filter web typecheck
pnpm.cmd --filter web test
pnpm.cmd --filter web build
```

## El backend no compila

```powershell
pnpm.cmd --filter api lint
pnpm.cmd --filter api typecheck
pnpm.cmd --filter api test
pnpm.cmd --filter api build
```

## El puerto 3000 o 3001 está ocupado

Identificar el proceso en Windows:

```powershell
Get-NetTCPConnection -State Listen |
Where-Object { $_.LocalPort -in 3000,3001 } |
Select-Object LocalAddress, LocalPort, OwningProcess
```

El backend admite cambiar su puerto mediante `PORT`.

---

# 17. Checklist de incorporación en una nueva PC

Antes de comenzar a desarrollar, comprobar:

```text
[ ] Git instalado y con identidad configurada
[ ] Node.js v24.19.0
[ ] Corepack disponible
[ ] pnpm 11.17.0
[ ] Repositorio clonado
[ ] Rama main actualizada
[ ] pnpm install --frozen-lockfile completado
[ ] pnpm check completado
[ ] Frontend abre en localhost:3000
[ ] API responde en localhost:3001/api/v1/health
[ ] Chromium de Playwright instalado si se ejecutarán E2E
```

---

# 18. Reglas importantes del proyecto

1. Usar **pnpm exclusivamente** para dependencias y scripts del proyecto.
2. Respetar las versiones fijadas en el repositorio.
3. No subir `.env`, claves, tokens, certificados ni credenciales.
4. Mantener un único `pnpm-lock.yaml` en la raíz.
5. Ejecutar `pnpm check` antes de integrar cambios.
6. Mantener frontend y backend desacoplados.
7. No convertir el frontend en fuente autoritativa de precio, stock, pedidos o pagos.
8. Las integraciones sensibles como Izipay deben realizarse desde el backend.
9. Agregar pruebas junto con las nuevas funcionalidades.
10. Mantener este README actualizado cuando cambie el setup del proyecto.

---

## Estado del proyecto

Actualmente el monorepo cuenta con:

- Base funcional de Next.js.
- Base funcional de NestJS.
- Home del frontend.
- Tests unitarios.
- Playwright E2E.
- Pruebas de accesibilidad.
- Quality gate de lint, typecheck, tests y build.
- Frontend preparado para despliegue en Vercel.

Las siguientes capacidades de negocio se incorporarán progresivamente conforme avance la implementación del ecommerce.
