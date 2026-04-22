# Guía de publicación y versionado de `inventario-ui`

Este documento define el contrato de distribución para que los 5 micro-frontends consuman la librería sin conflictos.

## 1. Regla principal

Durante una misma ola de migración, **todos los micro-frontends deben usar exactamente la misma versión de `inventario-ui`**.

Ejemplo recomendado en cada `package.json` consumidor:

```json
{
  "dependencies": {
    "inventario-ui": "1.0.0"
  }
}
```

No usar durante la migración:

```json
{
  "dependencies": {
    "inventario-ui": "^1.0.0"
  }
}
```

## 2. Matriz de compatibilidad inicial

| inventario-ui | Angular | @lucide/angular | Estado |
|---|---|---|---|
| 1.0.x | 20.x | 1.8.x | Soportado |

## 3. Política SemVer

### Patch (`1.0.1`)
- fixes visuales
- correcciones de packaging
- documentación
- cambios internos sin romper API

### Minor (`1.1.0`)
- nuevos componentes
- nuevos providers
- nuevas capacidades backward compatible

### Major (`2.0.0`)
- cambio de selectores
- cambios de inputs/outputs
- cambios obligatorios en integración del consumidor
- cambios de estilos globales que obliguen a adaptar micro-frontends

## 4. Estrategia de publicación

Usar una sola fuente de verdad:

- GitHub Packages, o
- npm privado, o
- registry interno equivalente

### Flujo recomendado

1. actualizar versión en `projects/inventario-ui/package.json`
2. generar changelog corto
3. publicar el paquete
4. actualizar los 5 micro-frontends a la **misma versión exacta**
5. validar el micro-frontend piloto
6. propagar al resto

## 4.1 Validación mínima antes de publicar

Antes de publicar una nueva versión:

1. ejecutar `npm run build`
2. verificar que la salida quede en `dist/inventario-ui`
3. confirmar que el package generado conserva los entrypoints esperados:
   - `inventario-ui`
   - `inventario-ui/styles`
   - `inventario-ui/tokens`
4. actualizar a esa misma versión exacta el micro-frontend piloto
5. recién después propagar al resto

### Estado validado actualmente

- Build OK en Angular 20 con compilación parcial
- Output generado en `dist/inventario-ui`
- La migración Sass ya quedó corregida en código:
  - `@import` → `@use`
  - `darken()` → `color.adjust()`

### Nota operativa

Por política del repositorio, después de esta corrección ya no se re-ejecutó el build en esta sesión.
La próxima publicación debe volver a correr `npm run build` para confirmar que desaparecieron esos warnings en el pipeline real.

## 5. Orden de rollout

1. publicar versión candidata de la librería
2. migrar 1 micro-frontend piloto
3. corregir issues reales de integración
4. publicar versión estable
5. migrar los otros 4 micro-frontends

## 6. Contrato m?nimo del consumidor

Cada micro-frontend debe:

1. instalar la misma versi?n exacta de `inventario-ui`
2. registrar `provideInventarioUi()` en `app.config.ts`
3. importar `@use 'inventario-ui/styles';` en `src/styles.scss` si necesita reset/tokens/utilidades globales
4. evitar imports internos como `inventario-ui/src/styles/...`
5. evitar `preserveSymlinks` salvo que exista una evidencia t?cnica nueva despu?s de corregir el empaquetado

## 7. Lo que no se debe hacer

- no usar `npm link` como estrategia base de integración
- no mezclar versiones distintas de `inventario-ui` entre micro-frontends durante la misma migración
- no duplicar registro manual de íconos base si ya se usa `provideInventarioUi()`
