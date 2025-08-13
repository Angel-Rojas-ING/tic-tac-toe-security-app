# DockerHub - Tic Tac Toe Security App

## 📦 Información de la Imagen Publicada

**DockerHub Repository:** https://hub.docker.com/r/angel697/tic-tac-toe-security-app  
**Imagen:** `angel697/tic-tac-toe-security-app`  
**Tags Disponibles:**
- `latest` - Última versión estable
- `v1.0` - Versión 1.0 específica

## 🚀 Comando de Ejecución

### Ejecución Simple
```bash
docker run -d --name tic-tac-toe-app -p 3000:3000 angel697/tic-tac-toe-security-app:latest
```

### Ejecución con Persistencia de Datos
```bash
docker run -d \
  --name tic-tac-toe-app \
  -p 3000:3000 \
  --restart unless-stopped \
  -v tic-tac-toe-data:/app \
  angel697/tic-tac-toe-security-app:latest
```

### Ejecución en Puerto Personalizado
```bash
docker run -d \
  --name tic-tac-toe-app \
  -p 8080:3000 \
  angel697/tic-tac-toe-security-app:latest
```

## 🔐 Credenciales de Acceso

### Usuario Administrador Pre-configurado
- **Username:** `admin`
- **Password:** `admin`
- **URL de Acceso:** http://localhost:3000

### Registro de Nuevos Usuarios
Los usuarios pueden registrarse en http://localhost:3000 con los siguientes requisitos:
- **Edad:** Mayor de 18 años
- **Contraseña:** 8+ caracteres (mayúsculas, minúsculas, números, caracteres especiales)
- **Teléfono:** Formato dominicano (809/829/849 + 7 dígitos)
- **Email:** Formato válido

## 📋 Características de la Aplicación

### 🎮 Funcionalidades del Juego
- ✅ Tic Tac Toe vs CPU con 3 niveles de dificultad (Easy, Medium, Hard)
- ✅ Sistema de estadísticas (victorias, derrotas, empates, win rate)
- ✅ Historial de partidas por usuario
- ✅ IA inteligente que adapta su estrategia según la dificultad

### 🔒 Características de Seguridad
- ✅ Autenticación segura con bcrypt
- ✅ Validación de entrada robusta
- ✅ Protección contra SQL injection
- ✅ Rate limiting para prevenir ataques de fuerza bruta
- ✅ Headers de seguridad HTTP (Helmet.js)
- ✅ Manejo seguro de sesiones
- ✅ Validaciones específicas (edad, contraseña, teléfono RD)

### 🐳 Características del Contenedor
- ✅ Basado en Node.js 18 Alpine (imagen liviana)
- ✅ Usuario no-root (nodeuser:1001) para mayor seguridad
- ✅ Health checks automáticos configurados
- ✅ Base de datos SQLite inicializada automáticamente
- ✅ Usuario admin pre-configurado
- ✅ Tamaño optimizado (~169MB)

## 🔧 Verificación de Funcionamiento

Después de ejecutar el contenedor, verifica que funciona correctamente:

### 1. Verificar Estado del Contenedor
```bash
docker ps | grep tic-tac-toe
```

### 2. Probar Conectividad
```bash
curl http://localhost:3000/api/session
# Respuesta esperada: {"loggedIn":false}
```

### 3. Probar Login Admin
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
# Respuesta esperada: {"message":"Login successful","username":"admin"}
```

### 4. Acceder a la Interfaz Web
Abrir navegador en: http://localhost:3000

## 📊 Análisis de Seguridad Incluido

Esta aplicación ha sido sometida a análisis completo de seguridad:

### 🔍 SAST (Static Application Security Testing)
- **Herramienta:** ESLint Security Plugin
- **Resultado:** 22 detecciones de validación, 3 vulnerabilidades de dependencias
- **Estado:** Aceptable para propósitos educativos

### 🔍 DAST (Dynamic Application Security Testing)  
- **Herramientas:** Manual testing, curl-based testing
- **Resultado:** 4 vulnerabilidades (1 alta, 2 medias, 1 baja)
- **Estado:** Seguro para desarrollo, requiere HTTPS para producción

### ✅ Cumplimiento de Estándares
- **OWASP Top 10 2021:** 70% de cumplimiento
- **Checklist de Seguridad:** 75% implementado
- **Puntuación General:** 7/10 (Bueno para propósitos educativos)

## 🛠️ Comandos de Gestión

### Logs y Monitoreo
```bash
# Ver logs en tiempo real
docker logs -f tic-tac-toe-app

# Verificar health check
docker inspect --format='{{json .State.Health}}' tic-tac-toe-app

# Estadísticas de recursos
docker stats tic-tac-toe-app --no-stream
```

### Backup y Mantenimiento
```bash
# Crear backup de base de datos
docker exec tic-tac-toe-app cp database.sqlite database_backup.sqlite

# Copiar backup al host
docker cp tic-tac-toe-app:/app/database_backup.sqlite ./backup/

# Reiniciar aplicación
docker restart tic-tac-toe-app
```

## 🎯 Propósito y Uso

### Casos de Uso Recomendados
- ✅ **Análisis de seguridad de aplicaciones web**
- ✅ **Educación en seguridad informática**
- ✅ **Testing de herramientas SAST/DAST**
- ✅ **Demostración de buenas prácticas de desarrollo seguro**
- ✅ **Laboratorios de seguridad**

### Casos de Uso NO Recomendados
- ❌ **Producción sin HTTPS**
- ❌ **Manejo de datos sensibles reales**
- ❌ **Aplicaciones críticas de negocio**

## 📞 Soporte y Contribuciones

### Repositorio del Código Fuente
[Disponible en GitHub] - Se publicará en el siguiente paso del proyecto

### Información Técnica
- **Base Image:** node:18-alpine
- **Tamaño:** ~169MB
- **Arquitectura:** x86_64, ARM64
- **Puerto:** 3000
- **Base de Datos:** SQLite (incluida)
- **Framework:** Express.js + Vanilla JavaScript

---

**Nota Importante:** Esta aplicación fue desarrollada específicamente para análisis de seguridad y propósitos educativos. Ha sido sometida a pruebas SAST y DAST completas. Para uso en producción, implementar las mejoras de seguridad recomendadas en los reportes de análisis.