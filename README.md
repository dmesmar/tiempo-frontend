# Tiempo — Frontend

Interfaz en Angular para consultar la predicción meteorológica de cualquier municipio de España. Se conecta al backend de Tiempo (https://github.com/dmesmar/tiempo-backend).

## Ejecución

### Requisitos previos

- Docker
- El backend de Tiempo corriendo en `http://localhost:8081` (ver instrucciones en su propio repositorio)

### Arrancar el contenedor

```bash
docker run -p 8080:80 dmesmar/tiempo-frontend:latest
```

La aplicación quedará disponible en `http://localhost:8080`.

## Funcionalidad

- Búsqueda de municipio con autocompletado (Angular Material)
- Selección de unidad de temperatura (Celsius / Fahrenheit)
- Cualquier cambio en municipio o unidad refresca automáticamente la predicción
- Visualización de la probabilidad de precipitación agrupada por franjas horarias (día completo, mañana/tarde, o tramos de 6 horas), según la granularidad disponible

## Arquitectura

- `components/tiempo-component`: componente principal, orquesta el buscador, el selector de unidad y el resultado
- `service/tiempo-service`: comunicación con el backend
- `models`: interfaces TypeScript que reflejan los DTOs del backend