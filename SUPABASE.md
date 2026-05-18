# Setup Supabase para AppGrid

## 1. Crear proyecto en Supabase

1. Ir a https://supabase.com
2. Click "Sign In"
3. Crear cuenta o loguearse
4. Click "New Project"
5. Llenar:
   - **Name:** AppGrid
   - **Password:** Tu contraseña segura
   - **Region:** Seleccionar cercano a LATAM (Brasil o USA)
6. Click "Create new project" (esperar 2-3 minutos)

## 2. Obtener credenciales

1. Una vez creado, ir a **Settings → API**
2. Copiar:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Actualizar .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

## 4. Crear tablas

En Supabase Dashboard:

1. Click **SQL Editor**
2. Click **New query**
3. Copiar contenido de `migrations/001_init.sql`
4. Pegar en el editor
5. Click **Run**

Listo! Las tablas están creadas.

## 5. Testear

```bash
npm run dev
# Visitar http://localhost:3000/admin
# La app debería conectar a Supabase
```

## Variables de entorno

| Variable | Valor | Dónde obtener |
|----------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key | Supabase → Settings → API |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Contraseña admin | Lo que quieras |

## En Railway (producción)

1. Ir a Railway dashboard
2. Seleccionar proyecto
3. Variables:
   - Agregar `NEXT_PUBLIC_SUPABASE_URL`
   - Agregar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Agregar `SUPABASE_SERVICE_ROLE_KEY`
   - Agregar `NEXT_PUBLIC_ADMIN_PASSWORD`
4. Redeploy

¡Listo! 🚀
