# Instrucciones para Testear Supabase Localmente

## En tu máquina local:

### 1. Actualizar código
```bash
git fetch origin
git checkout claude/phase2-supabase
```

### 2. Copiar credenciales a .env.local
```
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
NEXT_PUBLIC_SUPABASE_URL=https://ovnysqrtweadrpioqjkb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92bnlzcXJ0d2VhZHJwaW9xamtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTc5MzEsImV4cCI6MjA5NDY5MzkzMX0.qGHnun_e8aa4hNph0uKLwyIesOQmMnTw-XuyzG8ijiY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92bnlzcXJ0d2VhZHJwaW9xamtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTExNzkzMSwiZXhwIjoyMDk0NjkzOTMxfQ.Z3xmCMD79almeXSwEHaPGXkeza65s4Dlcy1ZcQ5q9l4
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Probar localmente
```bash
npm run dev
# Visitar http://localhost:3000
# Admin: http://localhost:3000/admin (contraseña: admin123)
```

### 5. Verificar que funciona
- Crear una app desde admin
- Ver que aparece en marketplace
- Editar y eliminar

## Si funciona:

```bash
git push origin claude/phase2-supabase
# Luego mergear a main
git checkout main
git merge claude/phase2-supabase
git push origin main
```

Railway deployará automáticamente con Supabase! 🚀

## Si no funciona:

Avísame el error exacto y lo arreglamos juntos.
