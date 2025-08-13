# Instrucciones para Capturas de Pantalla del Reporte

## 📸 Capturas Requeridas para Validar el Proyecto

### 1. GitHub Repository
**Ubicación en PDF:** Página 4 - Enlaces de GitHub  
**URL:** https://github.com/Angel-Rojas-ING/tic-tac-toe-security-app  
**Qué mostrar:**
- Página principal del repositorio
- Archivos del proyecto visibles
- README.md desplegado
- Topics del proyecto (security, tic-tac-toe, etc.)

### 2. DockerHub Repository  
**Ubicación en PDF:** Página 4 - Enlaces de DockerHub  
**URL:** https://hub.docker.com/r/angel697/tic-tac-toe-security-app  
**Qué mostrar:**
- Página del repositorio en DockerHub
- Tags disponibles (latest, v1.0)
- Información de la imagen (169MB)
- Descripción del proyecto

### 3. Resultado Trivy
**Ubicación en PDF:** Página 6 - Informe Trivy  
**Comando:** `trivy image angel697/tic-tac-toe-security-app:latest`  
**Qué mostrar:**
- Output completo de Trivy
- 0 vulnerabilidades en todos los componentes
- Alpine Linux 3.21.3 seguro
- 208 paquetes Node.js sin CVE

### 4. Pantalla de Login
**Ubicación en PDF:** Página 7 - Credenciales  
**URL:** http://localhost:3000  
**Qué mostrar:**
- Interfaz de login de la aplicación
- Campos de usuario y contraseña
- Formulario de registro (opcional)
- Design responsive de la aplicación

### 5. Dashboard del Juego (después del login)
**Ubicación en PDF:** Página 7 - Credenciales  
**URL:** http://localhost:3000/game.html  
**Qué mostrar:**
- Tablero de Tic Tac Toe
- Estadísticas del usuario
- Selector de dificultad
- Interfaz completa del juego funcionando

### 6. Docker PS (contenedor ejecutándose)
**Ubicación en PDF:** Página 8 - Comando Docker  
**Comando:** `docker ps | grep tic-tac-toe`  
**Qué mostrar:**
- Contenedor corriendo
- Puerto 3000 mapeado
- Status "Up" del contenedor
- Health check funcionando (si es visible)

### 7. Aplicación Web Funcionando
**Ubicación en PDF:** Página 8 - Comando Docker  
**URL:** http://localhost:3000  
**Qué mostrar:**
- Navegador con la aplicación funcionando
- URL localhost:3000 visible en la barra
- Interfaz completamente cargada
- Juego funcional (opcional: una partida en progreso)

## 🔧 Comandos para Preparar las Capturas

### Antes de tomar las capturas, ejecutar:

```bash
# 1. Ejecutar la aplicación
docker run -d --name tic-tac-toe-app -p 3000:3000 angel697/tic-tac-toe-security-app:latest

# 2. Verificar que funciona
curl http://localhost:3000/api/session

# 3. Ejecutar Trivy para la captura
trivy image angel697/tic-tac-toe-security-app:latest

# 4. Verificar contenedor
docker ps | grep tic-tac-toe

# 5. Test de login (opcional para demostrar funcionamiento)
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin"}'
```

## 📋 Checklist de Verificación

Antes de generar el PDF final, verificar que tienes:

- [ ] ✅ Captura GitHub repository
- [ ] ✅ Captura DockerHub image  
- [ ] ✅ Captura resultado Trivy (0 vulnerabilidades)
- [ ] ✅ Captura pantalla de login
- [ ] ✅ Captura dashboard del juego
- [ ] ✅ Captura docker ps
- [ ] ✅ Captura aplicación funcionando en navegador

## 💡 Tips para Mejores Capturas

1. **Usar navegador en modo incógnito** para capturas web limpias
2. **Maximizar ventanas** para mejor visibilidad
3. **Usar zoom 100%** para texto legible
4. **Incluir URL en la barra** del navegador cuando sea relevante
5. **Capturar pantalla completa** o área relevante bien definida

## 🎯 Orden de Inserción en PDF

1. Reemplazar cada placeholder "📸 CAPTURA DE PANTALLA" con la imagen correspondiente
2. Mantener el texto descriptivo debajo de cada imagen
3. Asegurar que las imágenes sean legibles en formato PDF
4. Verificar que todas las capturas muestren el funcionamiento correcto

## ⚠️ Importante

- **Todas las capturas deben mostrar FUNCIONAMIENTO REAL**
- **Verificar que los links y comandos funcionen antes de capturar**
- **Las imágenes son evidencia del trabajo realizado**
- **Calidad de imagen debe ser suficiente para lectura en PDF**