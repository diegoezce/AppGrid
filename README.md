# AppGrid — Marketplace para Developers

Plataforma donde developers publican SaaS, scripts y automatizaciones para monetizar sus creaciones en LATAM y España.

## Stack

- **Frontend:** Next.js 15 + React 18 + TypeScript
- **Database:** JSON local (fase 1) → Supabase (fase 2)
- **Deployment:** Railway
- **Design System:** Custom CSS (Inter + JetBrains Mono)

## Carpetas principales

- `/app` — Next.js App Router
  - `/app/page.tsx` — Landing / Home
  - `/app/admin/page.tsx` — Panel de admin (publicar apps)
  - `/app/marketplace/page.tsx` — Catálogo público de apps
  - `/app/api/apps/route.ts` — API para GET/POST apps
  - `/app/globals.css` — Estilos globales
- `/appmarket` — Diseños y chats del landing original
- `apps.json` — Base de datos temporal de apps (JSON)

## Setup

### 1. Instalar dependencias
```bash
npm install
```

### 2. Variables de entorno
```bash
cp .env.example .env.local
# Editar .env.local si es necesario
```

La contraseña del admin es: **admin123** (cambiar en producción)

### 3. Correr dev server
```bash
npm run dev
```

Luego abrí: [http://localhost:3000](http://localhost:3000)

## Rutas

- `/` — Landing page
- `/marketplace` — Catálogo de apps
- `/admin` — Panel para publicar apps (protegido con contraseña)
- `/api/apps` — API REST

## Fases

### Fase 1 (Ahora) ✅
- [x] Landing page
- [x] Admin panel básico
- [x] Marketplace para listar apps
- [x] API REST con almacenamiento JSON
- [x] Diseño integrado

### Fase 2 (Próximo)
- [ ] Migrar a Supabase (DB real)
- [ ] Autenticación de developers
- [ ] Dashboard personal por developer
- [ ] Sistema de pagos (Stripe)
- [ ] Transacciones y reportes

### Fase 3 (Futuro)
- [ ] Analytics avanzado
- [ ] Webhooks y notificaciones
- [ ] Integración con GitHub
- [ ] Multi-idioma

## Deploy en Railway

1. Pushear a GitHub
2. Conectar repo en Railway
3. Railway automáticamente detecta Next.js y deploya
4. Configurar variables de entorno en Railway dashboard

```bash
# Build
npm run build

# Start
npm run start
```

## Admin password en producción

En Railway, set la variable de entorno:
```
NEXT_PUBLIC_ADMIN_PASSWORD=tu_contraseña_secreta
```

## API Endpoints

### GET /api/apps
Obtener todas las apps publicadas
```bash
curl http://localhost:3000/api/apps
```

### POST /api/apps
Publicar una nueva app
```bash
curl -X POST http://localhost:3000/api/apps \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi App",
    "description": "Descripción",
    "category": "productivity",
    "app_url": "https://...",
    "image_url": "https://...",
    "price": "0"
  }'
```

## Apps de ejemplo

Las 5 apps del proyecto ya están cargadas en `apps.json`:
- GoPlanify
- Meal Prep GoPlanify
- Fidelis
- Students Manager
- Global Prayer App

## Contacto

Diego Ezce — [@diegoezce](https://github.com/diegoezce)
