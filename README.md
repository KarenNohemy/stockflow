# StockFlow

Aplicación de gestión de inventario desarrollada como prueba técnica.

## Estructura del proyecto

```text
stockflow/
│
├── inventory-service/
│   ├── src/
│   ├── pom.xml
│   └── README.md
│
├── inventory-app/
│   ├── src/
│   ├── package.json
│   └── README.md
│
└── README.md
```

---

# Tecnologías utilizadas

## Backend

* Java 21
* Spring Boot 3.5
* Spring Data JPA
* H2 Database
* Spring Validation
* Spring Actuator
* Springdoc OpenAPI (Swagger)
* Resilience4j
* JUnit 5
* Mockito

## Frontend

* Angular 18
* TypeScript
* Bootstrap 5
* Angular Signals
* RxJS
* Karma
* Jasmine

---

# Ejecución del Backend

Ingresar al módulo:

```bash
cd inventory-service
```

Ejecutar:

```bash
mvn spring-boot:run
```

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

Actuator Health:

```text
http://localhost:8080/actuator/health
```

---

# Ejecución del Frontend

Ingresar al módulo:

```bash
cd inventory-app
```

Instalar dependencias:

```bash
npm install
```

Ejecutar:

```bash
ng serve
```

Aplicación:

```text
http://localhost:4200
```

---

# Tiempo invertido

## Backend (11.5 horas)

| Módulo                                                               | Tiempo |
| -------------------------------------------------------------------- | -----: |
| Configuración inicial del proyecto, dependencias y arquitectura base |    1 h |
| Gestión de productos (CRUD y consultas)                              |  1.5 h |
| Registro y validación de movimientos de inventario                   |    2 h |
| Historial de movimientos                                             |    1 h |
| Alertas de stock bajo                                                |  0.5 h |
| Resumen y métricas de inventario                                     |  0.5 h |
| Manejo global de excepciones                                         |    1 h |
| Swagger/OpenAPI                                                      |  0.5 h |
| Actuator y observabilidad                                            |  0.5 h |
| Resilience4j (Retry, Circuit Breaker, Rate Limiter)                  |    1 h |
| Pruebas unitarias e integración                                      |    2 h |

**Total Backend: 11.5 horas**

---

## Frontend (20 horas)

| Módulo                                                  | Tiempo |
| ------------------------------------------------------- | -----: |
| Configuración inicial Angular y estructura del proyecto |    1 h |
| Modelos, servicios y capa de comunicación HTTP          |    2 h |
| Implementación de Inventory Store con Signals           |    2 h |
| Dashboard principal y métricas                          |    2 h |
| Tabla de productos con filtros y paginación             |    3 h |
| Formulario de movimientos y validaciones                |    2 h |
| Historial de movimientos                                |  1.5 h |
| Vista de alertas de inventario                          |    1 h |
| Manejo global de errores mediante interceptor           |    1 h |
| Toasts, loading states y estados vacíos                 |    1 h |
| Integración Frontend-Backend y ajustes de contratos     |  1.5 h |
| Pruebas unitarias                                       |    2 h |

**Total Frontend: 20 horas**

---

## Tiempo total invertido

| Área      |          Horas |
| --------- | -------------: |
| Backend   |           11.5 |
| Frontend  |             20 |
| **Total** | **31.5 horas** |


---

# Decisiones Técnicas Relevantes

## Backend

### Arquitectura por capas

Se implementó una arquitectura basada en:

* Controller
* Service
* Repository
* DTO
* Mapper

con el objetivo de mantener una separación clara de responsabilidades y facilitar la mantenibilidad del código.

### Manejo centralizado de excepciones

Se implementó un `GlobalExceptionHandler` para garantizar respuestas consistentes ante errores de negocio y validaciones.

Excepciones principales:

* ProductNotFoundException
* InsufficientStockException

### Resiliencia

Se incorporó Resilience4j utilizando:

* Retry
* Circuit Breaker
* Rate Limiter

para mejorar la tolerancia a fallos y robustez de la aplicación.

### Observabilidad

Se habilitaron endpoints de Actuator para monitoreo y verificación del estado de la aplicación.

### Documentación de API

Se integró Swagger/OpenAPI para facilitar la exploración y validación de los endpoints.

---

## Frontend

### Gestión reactiva del estado

Se utilizó Angular Signals mediante:

```typescript
signal()
computed()
effect()
```

permitiendo una administración reactiva del estado sin dependencias externas.

### Store centralizado

Se implementó un `InventoryStore` encargado de administrar:

* Productos
* Alertas
* Resumen de inventario
* Estado de carga
* Notificaciones de usuario

### Servicios desacoplados

Se creó un `ApiService` para centralizar la comunicación HTTP y evitar duplicación de lógica.

### Manejo global de errores

Se implementó un `HttpInterceptor` para capturar errores HTTP y mostrar mensajes consistentes al usuario.

### Componentes Standalone

Todos los componentes fueron desarrollados utilizando Angular Standalone Components.

### Experiencia de usuario

Se incorporaron:

* Toast notifications
* Loading states
* Empty states
* Dashboard de métricas
* Historial de movimientos
* Paginación de productos

---

# Pruebas

## Backend

Se implementaron pruebas para:

* Controllers
* Services
* Exception Handlers
* Mappers

## Frontend

Se implementaron pruebas para:

* Components
* Services
* Store
* Interceptors

Cobertura actual aproximada:

```text
Backend > 80%
Frontend > 50%
```

---

# Historial de desarrollo

El repositorio contiene commits atómicos y descriptivos que reflejan la evolución incremental del proyecto, incluyendo:

* Configuración inicial del proyecto
* Implementación de entidades y persistencia
* Gestión de inventario y movimientos
* Alertas de stock
* Resiliencia y observabilidad
* Integración Frontend / Backend
* Gestión reactiva del estado
* Manejo global de errores
* Implementación de pruebas unitarias
* Documentación técnica

---

# Autor

Karen Nohemy López Cerrato

Prueba Técnica - StockFlow
