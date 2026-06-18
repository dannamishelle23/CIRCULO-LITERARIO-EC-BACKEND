# Guía de Pruebas del Backend - Círculo Literario EC

## Resumen Ejecutivo

Se han implementado **32 pruebas unitarias** y **2 benchmarks de rendimiento** en el backend para validar funcionamiento correcto, validaciones y desempeño:

- ✅ **32/32 tests unitarios** pasando
- ✅ **7 archivos de test** creados
- ✅ **Cobertura**: autenticación, obras, comentarios, validadores

---

## 📋 Cómo Ejecutar las Pruebas

### 1. **Todas las Pruebas Unitarias**
```bash
cd backend
npx vitest run
```

**Resultado esperado:**
```
 Test Files  7 passed (7)
      Tests  32 passed (32)
```

---

### 2. **Solo Pruebas de un Archivo**
```bash
# Tests de autenticación
npx vitest run src/controllers/auth_controller.test.js

# Tests de obras
npx vitest run src/controllers/obras_controller.test.js

# Tests de comentarios
npx vitest run src/controllers/comentarios_controller.test.js
```

---

### 3. **Pruebas de Rendimiento (Benchmarks)**
```bash
npx vitest bench
```

**Resultado esperado:**
```
 BENCH  Summary

  performance de login auth_controller - src/controllers/auth_controller.bench.js > 
    10.79x faster than performance de registro auth_controller
```

---

### 4. **Pruebas de Aceptación (HTTP Routes)**
```bash
# Rutas de autenticación
npx vitest run src/auth_routes_acceptance.test.js

# Rutas de comentarios
npx vitest run src/routes_acceptance.test.js
```

---

## 🎯 Qué Significan los Resultados

### A. Tests Unitarios

Cada test verifica un caso específico. Ejemplo de `obras_controller.test.js`:

| Test | Qué Valida |
|------|-----------|
| `crearObra debe devolver 400 si faltan campos` | Validación de campos obligatorios |
| `crearObra debe devolver 400 si el club no existe` | Club debe existir en BD |
| `crearObra debe devolver 403 si usuario no es miembro` | Usuario debe estar en club aprobado |
| `postularObra debe devolver 403 si no es autor` | Solo autor puede postular |
| `postularObra debe devolver 400 si no hay 3 capítulos` | Mínimo 3 capítulos requerido |
| `iniciarVotacion debe validar que club existe` | Club debe existir |
| `iniciarVotacion debe devolver 403 si club está suspendido` | Club en "Activo" es obligatorio |
| `eliminarObra debe devolver 404 si no existe` | Obra debe existir |
| `eliminarObra debe devolver 403 si no es autor` | Solo autor/admin puede eliminar |
| `eliminarObra debe devolver 400 si está en votación` | No se puede borrar en EnVotacion |
| `eliminarObra debe eliminar si está en Borrador` | Funciona en estado Borrador |

---

### B. Benchmarks de Rendimiento

**Métrica: Hz (operaciones/segundo)**

```
Registro (sign up):       2,074.28 ops/sec
Login:                   22,373.32 ops/sec
                         ─────────────────
Ratio:                   10.79x más rápido el login
```

**Interpretación:**
- **Hz (Hertz)**: Cuántas operaciones se completan en 1 segundo
- **min/max**: Tiempo mínimo y máximo de una operación (ms)
- **mean**: Promedio de tiempo (ms)
- **p99**: 99% de operaciones completadas en menos de este tiempo
- **rme**: Rango de margen de error (±4.91% = medición confiable)

**Significado práctico:**
- Login: ~0.0447 ms (muy rápido)
- Registro: ~0.4821 ms (lento porque envía email)
- El sistema puede manejar miles de logins/segundo

---

### C. Pruebas de Aceptación (HTTP)

Verifican que los endpoints responden correctamente con status HTTP y datos:

```
✓ POST /api/auth/registro → 200 (usuario creado)
✓ POST /api/auth/login → 200 (token generado)
✓ GET /api/auth/confirmar/:token → 200 (cuenta confirmada)
✓ POST /api/comentarios/obra/:obraId → 201 (comentario creado)
```

---

## 🔍 Archivos de Prueba Creados

```
backend/src/
├── controllers/
│   ├── auth_controller.test.js         (7 tests)
│   ├── auth_controller.bench.js        (2 benchmarks)
│   ├── obras_controller.test.js        (11 tests)
│   └── comentarios_controller.test.js  (4 tests)
├── validators/
│   └── auth_validator.test.js          (3 tests)
├── utils/
│   └── calcularEdad.test.js            (2 tests)
├── auth_routes_acceptance.test.js      (3 tests - HTTP)
└── routes_acceptance.test.js           (2 tests - HTTP)
```

---

## ✅ Validaciones Implementadas

### 1. **Auth Controller** (`auth_controller.test.js`)
- ✓ Rechaza usuarios existentes
- ✓ Rechaza contraseñas débiles (< 8 caracteres)
- ✓ Rechaza menores de 13 años
- ✓ Requiere email válido y único
- ✓ Envía email de confirmación
- ✓ Bloquea login sin confirmar email
- ✓ Recuperación de contraseña por email

### 2. **Obras Controller** (`obras_controller.test.js`)
- ✓ Club debe existir y estar "Activo"
- ✓ Usuario debe ser miembro aprobado del club
- ✓ Obra debe tener 3+ capítulos para postular
- ✓ Solo autor puede postular o eliminar
- ✓ Fechas de votación deben ser válidas
- ✓ No se pueden eliminar obras en votación/revisión/publicadas
- ✓ Soft-delete (marcar como inactivo, no borrar de BD)

### 3. **Comentarios Controller** (`comentarios_controller.test.js`)
- ✓ Solo puede comentar en obras "Publicada"
- ✓ Período de comentarios: 2 semanas desde publicación
- ✓ Historial de cambios en comentarios editados

### 4. **Validadores** (`auth_validator.test.js`)
- ✓ Username: 4-20 caracteres, no puede iniciar/terminar con _
- ✓ Contraseña: 8-30 caracteres, mayúscula, minúscula, número, símbolo
- ✓ Email: formato válido, máximo 100 caracteres
- ✓ Fecha: no futura, entre 1900 y hoy
- ✓ Edad: mínimo 13 años

---

## 🚀 Comandos Rápidos

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con cobertura de código
npx vitest run --coverage

# Ejecutar solo benchmarks
npx vitest bench

# Modo watch (re-ejecuta en cambios)
npx vitest watch

# Ver más detalles de fallos
npx vitest run --reporter=verbose
```

---

## ❌ Si Algo Falla

### Error: "Cannot find module 'vitest'"
```bash
npm install --save-dev vitest
```

### Error: "Cannot parse .test.js file"
Verificar que el archivo no tiene `bench()` dentro de `describe()` o `it()`. Los benchmarks deben estar en archivos `.bench.js` separados.

### Error: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

---

## 📊 Sobre Load Testing vs Benchmarks

### ¿Qué Hacen ESTAS PRUEBAS?

**Benchmarks (Lo que tenemos):**
- Miden la velocidad de **una operación individual**
- En ambiente sin carga
- Resultado: "Login toma 0.0447 ms"
- Útil para: Encontrar cuellos de botella, optimizar código

**Tests Unitarios:**
- Verifican que funciona **correctamente**
- Validan lógica de negocio
- Aseguran que validaciones funcionan
- Útil para: Prevenir bugs, documentar requisitos

---

### ¿Qué NO Hacen ESTAS PRUEBAS?

**Load Testing (Lo que NO tenemos):**
- Simular **cientos/miles de usuarios simultáneamente**
- Verificar comportamiento bajo presión
- Medir degradación de rendimiento
- Encontrar límites del sistema
- Ejemplo: "¿Qué pasa si 1000 usuarios hacen login a la vez?"

---

### ¿Se Necesita Load Testing?

| Situación | ¿Necesario? | Cómo |
|-----------|-----------|------|
| Desarrollo inicial | ❌ No | Primero unit tests |
| Pre-producción | ✅ Sí | Artillery, k6, Apache JMeter |
| Producción con usuarios | ✅ Sí | Monitoreo continuo |
| Cambios grandes | ✅ Sí | Re-validar capacidad |

---

### Herramientas para Load Testing (si se necesita en futuro)

**Artillery** (Recomendado, JavaScript):
```bash
npm install -g artillery
artillery quick --count 100 --num 10 http://localhost:3000/api/auth/login
```

**k6** (Lenguaje propio, muy potente):
```javascript
import http from 'k6/http';
export let options = { vus: 100, duration: '30s' };
export default () => http.get('http://localhost:3000/api/');
```

**Apache JMeter** (GUI, multi-protocolo):
- Descarga: https://jmeter.apache.org/
- Crea planes de test gráficamente
- Simula cientos de usuarios

---

## 📈 Próximas Mejoras

1. **Más validaciones:**
   - [ ] Tests para `club_controller.js`
   - [ ] Tests para `usuario_controller.js`
   - [ ] Tests para `capitulos_controller.js`

2. **Cobertura de código:**
   ```bash
   npx vitest run --coverage
   ```

3. **Load Testing:**
   - Configurar Artillery después de producción
   - Establecer límites de carga máxima
   - Monitorear con herramientas APM

4. **Integración Continua:**
   - GitHub Actions para ejecutar tests en cada push
   - Bloquear merge si tests fallan

---

## 📞 Soporte

Si hay problemas:
1. Revisar logs en la terminal
2. Verificar que `.env` tiene todas las variables
3. Limpiar `node_modules` y reinstalar: `npm ci`
4. Ejecutar: `npm test -- --reporter=verbose`

---

**Última actualización:** 2024
**Tests totales:** 32 unitarios + 2 benchmarks
**Estado:** ✅ Todos pasando
