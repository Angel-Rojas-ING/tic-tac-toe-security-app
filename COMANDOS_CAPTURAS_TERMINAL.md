# 🖥️ Comandos para Capturas de Terminal - SAST/DAST

## 📸 Capturas Adicionales Importantes para SAST/DAST

### 1. 🔍 CAPTURA SAST - ESLint Security
**Ubicación en PDF:** Página 3 - Análisis SAST  
**Comando:**
```bash
cd tic-tac-toe-app
npx eslint . --ext .js
```
**Qué mostrar:**
- Output completo de ESLint con las 22 detecciones
- Errores de "Generic Object Injection Sink"
- Archivos analizados (server.js, public/game.js, etc.)
- Líneas específicas con problemas

### 2. 🔍 CAPTURA SAST - npm audit
**Ubicación en PDF:** Página 3 - Análisis SAST  
**Comando:**
```bash
cd tic-tac-toe-app
npm audit
```
**Qué mostrar:**
- Las 3 vulnerabilidades de alta severidad
- Información del CVE de semver
- Recomendación "npm audit fix --force"
- Summary con paquetes afectados

### 3. 🔍 CAPTURA DAST - Test SQL Injection
**Ubicación en PDF:** Página 4 - Análisis DAST  
**Comando:**
```bash
# Primero asegurar que la app está corriendo
docker run -d --name tic-tac-toe-test -p 3000:3000 angel697/tic-tac-toe-security-app:latest

# Esperar 10 segundos y luego hacer las pruebas
sleep 10

# Test 1: SQL Injection fallido (protegido)
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"username":"admin\"; DROP TABLE users; --","password":"any"}'

# Test 2: Rate limiting
for i in {1..6}; do curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"username":"admin","password":"wrong"}' -s; echo; done
```
**Qué mostrar:**
- Intento de SQL injection devolviendo "Invalid credentials"
- Rate limiting activándose tras varios intentos
- Mensaje "Too many requests, please try again later"

### 4. 🔍 CAPTURA DAST - Headers de Seguridad
**Ubicación en PDF:** Página 4 - Análisis DAST  
**Comando:**
```bash
curl -I http://localhost:3000
```
**Qué mostrar:**
- Headers de Helmet.js activos
- Content-Security-Policy
- X-Frame-Options: SAMEORIGIN
- Strict-Transport-Security
- X-Content-Type-Options: nosniff

### 5. 🔍 CAPTURA TRIVY - Resultado Completo
**Ubicación en PDF:** Página 5 - Análisis Trivy  
**Comando:**
```bash
trivy image angel697/tic-tac-toe-security-app:latest
```
**Qué mostrar:**
- Report Summary con 0 vulnerabilidades
- Alpine 3.21.3 sin vulnerabilidades
- Todos los paquetes Node.js limpios
- Tabla completa con todos los packages analizados

### 6. 🔍 CAPTURA TRIVY - Solo Críticas/Altas
**Ubicación en PDF:** Página 5 - Análisis Trivy  
**Comando:**
```bash
trivy image --severity HIGH,CRITICAL angel697/tic-tac-toe-security-app:latest
```
**Qué mostrar:**
- Confirmación de 0 vulnerabilidades altas y críticas
- Mensaje claro de que el contenedor es seguro

## 🖥️ Comandos de Preparación para TODAS las Capturas

### Secuencia Completa para Capturar Todo:

```bash
# 1. Limpiar contenedores previos
docker stop $(docker ps -q --filter "name=tic-tac-toe") 2>/dev/null || true
docker rm $(docker ps -aq --filter "name=tic-tac-toe") 2>/dev/null || true

# 2. Ejecutar aplicación fresca
docker run -d --name tic-tac-toe-app -p 3000:3000 angel697/tic-tac-toe-security-app:latest

# 3. Esperar que inicialice
sleep 15

# 4. SAST - ESLint (dentro del directorio del proyecto)
echo "=== CAPTURA SAST - ESLINT ==="
npx eslint . --ext .js

# 5. SAST - npm audit  
echo "=== CAPTURA SAST - NPM AUDIT ==="
npm audit

# 6. DAST - Headers
echo "=== CAPTURA DAST - HEADERS ==="
curl -I http://localhost:3000

# 7. DAST - SQL Injection Test
echo "=== CAPTURA DAST - SQL INJECTION ==="
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"username":"admin\"; DROP TABLE users; --","password":"any"}'

# 8. DAST - Rate Limiting
echo "=== CAPTURA DAST - RATE LIMITING ==="
for i in {1..6}; do 
  echo "Intento $i:"
  curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"username":"admin","password":"wrong"}' -s
  echo
done

# 9. Trivy - Análisis completo
echo "=== CAPTURA TRIVY - COMPLETO ==="
trivy image angel697/tic-tac-toe-security-app:latest

# 10. Trivy - Solo críticas/altas
echo "=== CAPTURA TRIVY - CRITICAS/ALTAS ==="
trivy image --severity HIGH,CRITICAL angel697/tic-tac-toe-security-app:latest

# 11. Verificar funcionamiento
echo "=== VERIFICACION FUNCIONAMIENTO ==="
curl http://localhost:3000/api/session
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin"}'

# 12. Docker ps
echo "=== CAPTURA DOCKER PS ==="
docker ps | grep tic-tac-toe
```

## 📋 Lista de Capturas SAST/DAST Requeridas

### ✅ Para el Reporte PDF:

1. **📸 ESLint Security Output** - Mostrando las 22 detecciones
2. **📸 npm audit Output** - Mostrando las 3 vulnerabilidades de dependencias  
3. **📸 curl Headers** - Mostrando headers de seguridad implementados
4. **📸 SQL Injection Test** - Mostrando que está protegido
5. **📸 Rate Limiting** - Mostrando bloqueo tras intentos fallidos
6. **📸 Trivy Full Report** - Mostrando 0 vulnerabilidades
7. **📸 Trivy Critical/High** - Confirmando 0 vulnerabilidades críticas
8. **📸 Docker PS** - Mostrando contenedor ejecutándose
9. **📸 App Login Page** - Interfaz web funcionando
10. **📸 App Game Dashboard** - Juego funcionando post-login

## 💡 Tips para Capturas de Terminal

1. **Usar terminal con fondo oscuro** para mejor contraste
2. **Maximizar ventana** para capturar más contenido
3. **Usar scroll** si el output es muy largo
4. **Capturar comando + resultado** en la misma imagen
5. **Font size** apropiado para lectura en PDF

## ⚠️ Importante

- **Ejecutar comandos en orden** para que todo funcione
- **Esperar 15 segundos** después de docker run antes de tests
- **Verificar que puerto 3000** esté libre antes de empezar
- **Las capturas demuestran ejecución real** de las herramientas
- **Incluir tanto comando como resultado** en cada captura

## 🎯 Ubicaciones en PDF para cada Captura

| Captura | Página PDF | Sección |
|---------|------------|---------|
| ESLint Security | 3 | Análisis SAST |
| npm audit | 3 | Análisis SAST |
| Headers Security | 4 | Análisis DAST |
| SQL Injection | 4 | Análisis DAST |
| Rate Limiting | 4 | Análisis DAST |
| Trivy Full | 5 | Análisis Trivy |
| Trivy Critical | 5 | Análisis Trivy |
| Docker PS | 7 | Comando Docker |
| Login Page | 6 | Credenciales |
| Game Dashboard | 6 | Credenciales |