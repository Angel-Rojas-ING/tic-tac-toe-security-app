# Guía de Despliegue Docker - Tic Tac Toe Security App

## Información de la Imagen

**Nombre de la Imagen:** `tic-tac-toe-security-app`  
**Tag:** `latest`  
**Tamaño Aproximado:** ~150MB  
**Base Image:** `node:18-alpine`

## Comandos de Despliegue

### 🚀 Despliegue Simple
```bash
docker run -d \
  --name tic-tac-toe-app \
  -p 3000:3000 \
  tic-tac-toe-security-app:latest
```

### 🔧 Despliegue con Configuración Completa
```bash
docker run -d \
  --name tic-tac-toe-production \
  -p 3000:3000 \
  --restart unless-stopped \
  -v tic-tac-toe-data:/app/data \
  --health-interval=30s \
  --health-timeout=3s \
  --health-retries=3 \
  tic-tac-toe-security-app:latest
```

### 📊 Despliegue con Monitoreo
```bash
docker run -d \
  --name tic-tac-toe-monitored \
  -p 3000:3000 \
  --restart unless-stopped \
  -v tic-tac-toe-data:/app/data \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  tic-tac-toe-security-app:latest
```

## Configuración de Volúmenes

### Persistencia de Base de Datos
```bash
# Crear volumen para persistir la base de datos SQLite
docker volume create tic-tac-toe-data

# Usar el volumen en el despliegue
docker run -d \
  --name tic-tac-toe-app \
  -p 3000:3000 \
  -v tic-tac-toe-data:/app \
  tic-tac-toe-security-app:latest
```

## Variables de Entorno

### Variables Disponibles
```bash
# Puerto de la aplicación (por defecto: 3000)
-e PORT=3000

# Nivel de logging (por defecto: info)
-e LOG_LEVEL=info

# Modo de entorno (por defecto: production)
-e NODE_ENV=production
```

### Ejemplo con Variables
```bash
docker run -d \
  --name tic-tac-toe-custom \
  -p 8080:8080 \
  -e PORT=8080 \
  -e NODE_ENV=production \
  -e LOG_LEVEL=debug \
  tic-tac-toe-security-app:latest
```

## Mapeo de Puertos

| Puerto Interno | Puerto Externo | Descripción |
|---------------|----------------|-------------|
| 3000 | 3000 (configurable) | Puerto principal de la aplicación web |

### Ejemplos de Mapeo
```bash
# Puerto estándar
-p 3000:3000

# Puerto personalizado
-p 8080:3000

# Solo localhost
-p 127.0.0.1:3000:3000
```

## Health Checks

La imagen incluye health checks automáticos:

```bash
# Verificar estado del contenedor
docker ps --format "table {{.Names}}\t{{.Status}}"

# Ver logs de health check
docker inspect --format='{{json .State.Health}}' tic-tac-toe-app
```

## Comandos de Gestión

### 📋 Comandos Básicos
```bash
# Iniciar contenedor
docker start tic-tac-toe-app

# Detener contenedor
docker stop tic-tac-toe-app

# Reiniciar contenedor
docker restart tic-tac-toe-app

# Ver logs
docker logs tic-tac-toe-app

# Ver logs en tiempo real
docker logs -f tic-tac-toe-app

# Ejecutar comando dentro del contenedor
docker exec -it tic-tac-toe-app sh
```

### 🔍 Comandos de Diagnóstico
```bash
# Ver estadísticas de recursos
docker stats tic-tac-toe-app

# Inspeccionar configuración
docker inspect tic-tac-toe-app

# Ver procesos internos
docker exec tic-tac-toe-app ps aux
```

## Backup y Restauración

### 📁 Backup de Base de Datos
```bash
# Crear backup de la base de datos
docker exec tic-tac-toe-app cp database.sqlite database_backup.sqlite

# Copiar backup al host
docker cp tic-tac-toe-app:/app/database_backup.sqlite ./backup/
```

### 🔄 Restauración
```bash
# Copiar backup al contenedor
docker cp ./backup/database_backup.sqlite tic-tac-toe-app:/app/

# Restaurar dentro del contenedor
docker exec tic-tac-toe-app cp database_backup.sqlite database.sqlite

# Reiniciar para aplicar cambios
docker restart tic-tac-toe-app
```

## Seguridad del Contenedor

### 🔒 Configuraciones de Seguridad Implementadas
- ✅ Usuario no-root (nodeuser:1001)
- ✅ Imagen base Alpine (menor superficie de ataque)
- ✅ Health checks configurados
- ✅ Permisos de archivos restringidos
- ✅ Puerto no privilegiado (3000)

### 🛡️ Hardening Adicional
```bash
# Ejecutar con capacidades limitadas
docker run -d \
  --name tic-tac-toe-secure \
  -p 3000:3000 \
  --cap-drop ALL \
  --cap-add CHOWN \
  --cap-add SETGID \
  --cap-add SETUID \
  --read-only \
  --tmpfs /tmp \
  tic-tac-toe-security-app:latest
```

## Troubleshooting

### 🚨 Problemas Comunes

#### Contenedor no inicia
```bash
# Ver logs de error
docker logs tic-tac-toe-app

# Verificar imagen
docker images | grep tic-tac-toe

# Verificar puertos disponibles
netstat -tulpn | grep :3000
```

#### Base de datos corrupta
```bash
# Eliminar contenedor y volumen
docker rm -f tic-tac-toe-app
docker volume rm tic-tac-toe-data

# Recrear con datos limpios
docker run -d --name tic-tac-toe-app -p 3000:3000 tic-tac-toe-security-app:latest
```

#### Problemas de permisos
```bash
# Verificar usuario interno
docker exec tic-tac-toe-app whoami

# Verificar permisos de archivos
docker exec tic-tac-toe-app ls -la /app
```

## Credenciales de Acceso

### 👤 Usuario Administrador por Defecto
- **Username:** `admin`
- **Password:** `admin`
- **Email:** `admin@test.com`

### 🔑 Crear Usuarios Adicionales
Accede a http://localhost:3000 y utiliza el formulario de registro con los siguientes requisitos:
- Edad: 18+ años
- Contraseña: 8+ caracteres (mayúsculas, minúsculas, números, caracteres especiales)
- Teléfono: Formato dominicano (809/829/849)

## Monitoreo y Logs

### 📊 Métricas Disponibles
```bash
# CPU y memoria en tiempo real
docker stats tic-tac-toe-app --no-stream

# Información de health check
docker inspect tic-tac-toe-app | grep -A 10 "Health"
```

### 📝 Configuración de Logs
```bash
# Configurar rotación de logs
docker run -d \
  --name tic-tac-toe-app \
  -p 3000:3000 \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=5 \
  tic-tac-toe-security-app:latest
```

## Desarrollo y Testing

### 🔬 Modo Desarrollo
```bash
# Montar código fuente para desarrollo
docker run -d \
  --name tic-tac-toe-dev \
  -p 3000:3000 \
  -v $(pwd):/app \
  -e NODE_ENV=development \
  tic-tac-toe-security-app:latest
```

### 🧪 Ejecutar Tests
```bash
# Ejecutar tests dentro del contenedor
docker exec tic-tac-toe-app npm test

# Ejecutar análisis de seguridad
docker exec tic-tac-toe-app npm audit
```

## Información de Compatibilidad

- **Docker:** 20.10+
- **Docker Compose:** 2.0+
- **Arquitecturas:** x86_64, ARM64
- **Sistemas Operativos:** Linux, macOS, Windows (con WSL2)

---

**Nota:** Esta aplicación fue desarrollada para propósitos educativos y análisis de seguridad. Para uso en producción, implementar HTTPS y configuraciones adicionales de seguridad.