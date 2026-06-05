# AppGrid

AppGrid es una comunidad y marketplace para developers de LATAM y España. Permite publicar aplicaciones, mostrar avances, descubrir otros builders y gestionar interesados o compradores desde un mismo lugar.

## Funcionalidades

- Marketplace público con detalle, categorías, precios, keywords y ratings.
- Directorio de Builders y perfiles públicos accesibles sin iniciar sesión.
- Feed de novedades de los builders que seguís.
- Acciones sociales: seguir builders, dar likes y comentar actualizaciones.
- Autenticación con email y contraseña mediante Supabase Auth.
- Panel privado para publicar y administrar apps, updates y compradores.
- Registro y seguimiento del estado de compras.
- Interfaz disponible en español e inglés.
- Notificaciones de nuevas compras por email mediante Mailjet.

> La navegación del marketplace, Builders y perfiles públicos no requiere una cuenta. Iniciar sesión es necesario para publicar contenido y realizar acciones sociales.

## Stack

- Next.js 15 con App Router
- React 18 y TypeScript
- Supabase: PostgreSQL, Auth y API
- CSS propio
- Mailjet para notificaciones por email
- Railway para deployment

## Requisitos

- Node.js 20 (ver `.nvmrc`)
- npm
- Un proyecto de Supabase
- Una cuenta de Mailjet, solamente si se desean enviar notificaciones

## Desarrollo local

1. Instalá las dependencias:

   ```bash
   npm install
   ```

2. Creá el archivo de variables de entorno:

   ```bash
   cp .env.example .env.local
   ```

3. Completá las credenciales de Supabase en `.env.local`.

4. Ejecutá, en orden, las migraciones de `migrations/001_init.sql` a `migrations/008_auto_create_user_profile.sql` desde el SQL Editor de Supabase.

5. Iniciá el servidor:

   ```bash
   npm run dev
   ```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

Para una explicación más detallada de Supabase, consultá [SUPABASE.md](./SUPABASE.md).

## Variables de entorno

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | URL pública del proyecto de Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí | Clave pública `anon` de Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Sí | Clave privada usada por las rutas de servidor. |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | No | Variable heredada; el panel actual usa Supabase Auth. |
| `MAILJET_API_KEY` | No | API key para notificaciones de compras. |
| `MAILJET_API_SECRET` | No | API secret para notificaciones de compras. |
| `NEXT_PUBLIC_SITE_URL` | No | URL base incluida en los emails; por defecto usa `http://localhost:3000`. |

Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` en el cliente ni la subas al repositorio.

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Ejecutar el build de producción
```

El script `npm run lint` todavía requiere completar la migración de `next lint` a ESLint CLI antes de poder usarse como chequeo automatizado.

## Rutas principales

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público | Landing de AppGrid. |
| `/marketplace` | Público | Catálogo de aplicaciones. |
| `/marketplace/[id]` | Público | Detalle y compra de una app. |
| `/builders` | Público | Directorio de builders. |
| `/builders/[username]` | Público | Perfil, apps y novedades de un builder. |
| `/feed` | Con sesión | Feed personalizado de builders seguidos. |
| `/auth` | Público | Registro e inicio de sesión. |
| `/profile` | Con sesión | Edición del perfil del builder. |
| `/admin` | Con sesión | Gestión de apps, updates y compradores. |
| `/pago-exitoso` | Público | Confirmación posterior a una compra. |

## API

Las rutas REST viven en `app/api`:

| Endpoint | Operaciones principales |
| --- | --- |
| `/api/apps` y `/api/apps/[id]` | Listar, crear, editar, eliminar y consultar apps. |
| `/api/apps/[id]/rate` | Crear y consultar ratings. |
| `/api/builders` y `/api/builders/[username]` | Listar builders y gestionar perfiles públicos. |
| `/api/feed` | Obtener el feed personalizado. |
| `/api/follows` | Seguir, dejar de seguir y consultar relaciones. |
| `/api/updates` | Publicar y administrar novedades. |
| `/api/updates/[id]/like` | Dar o quitar likes. |
| `/api/updates/[id]/comments` | Crear y consultar comentarios. |
| `/api/purchases` y `/api/purchases/[id]` | Registrar compras y actualizar su estado. |

## Estructura del proyecto

```text
app/
  api/             Rutas REST
  components/      Componentes compartidos
  i18n/            Traducciones y contexto de idioma
  builders/        Directorio y perfiles públicos
  marketplace/     Catálogo y detalle de apps
  admin/            Panel privado del developer
  feed/             Feed social
lib/                Clientes de Supabase, Mailjet y moderación
migrations/         Migraciones SQL de Supabase
public/             Assets estáticos
```

## Deployment en Railway

1. Conectá el repositorio a un proyecto de Railway.
2. Configurá las variables de entorno necesarias.
3. Verificá que todas las migraciones estén aplicadas en Supabase.
4. Railway ejecutará el build y el start definidos por el proyecto.

También podés validar el build localmente:

```bash
npm run build
npm run start
```

## Contacto

Diego Ezce - [@diegoezce](https://github.com/diegoezce)
