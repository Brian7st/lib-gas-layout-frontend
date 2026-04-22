# inventario-ui — Librería de UI compartida

Librería Angular 20 con la estructura visual base para todos los micro-frontends del sistema de inventario SENA.

## Qué incluye

- `MainLayoutComponent` — shell completo (barra lateral + barra superior + router-outlet)
- `BarraLateralComponent` — barra lateral fija de 256px, navegación configurable por `@Input()`
- `BarraSuperiorComponent` — header fijo de 64px, perfil y buscador configurables por `@Input()`
- `BarraLateralConfig`, `NavGrupo`, `NavItem`, `PerfilConfig` — tipos exportados para tipar la configuración
- `styles/_variables.scss` — paleta de colores, tipografía, radios y sombras
- `styles/styles.scss` — reset, fuentes, layout y utilidades globales

## Cómo buildear

```bash
cd inventario-ui
npm install
npm run build
```

Genera `dist/inventario-ui/`.

## Cómo consumir en otro micro-frontend

### 1. Instalar

```bash
# Recomendado para micro-frontends: misma versi?n exacta en todos los consumidores
npm install inventario-ui@1.0.0

# Desarrollo local estable (evitar npm link en Angular)
npm install "file:../lib-gas-layout-frontend/dist/inventario-ui"
```

> Durante la migraci?n de los 5 micro-frontends, us? la **misma versi?n exacta** de `inventario-ui` en todos. Evit? `^` o `~` hasta terminar la ola de migraci?n.

### 2. Estilos compartidos

El **shell principal ya incluye sus estilos cr?ticos** dentro de `MainLayoutComponent`, as? que la barra lateral, la barra superior y los espacios base del layout no dependen de un global obligatorio.

Si quer?s sumar reset, tipograf?as y utilidades compartidas entre micro-frontends, agreg? esto en el `src/styles.scss` del consumidor:

```scss
@use 'inventario-ui/styles';
```

Si adem?s necesit?s reutilizar tokens Sass desde el micro-frontend:

```scss
@use 'inventario-ui/tokens' as inventario;

.mi-clase {
  color: inventario.$color-primario;
}
```

No uses imports internos del paquete como:

```scss
@use 'inventario-ui/src/styles/styles.scss';
```

Si eso hiciera falta en un consumidor, el problema est? en el empaquetado de la librer?a y no en el micro-frontend.

### 3. Registrar providers de la librer?a

La librer?a expone `provideInventarioUi()` como punto ?nico de integraci?n para registrar el set base de ?conos din?micos y simplificar la migraci?n entre micro-frontends.

Us? esto como base en el `app.config.ts` del consumidor:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideInventarioUi } from 'inventario-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideInventarioUi()
  ]
};
```

Si un micro-frontend necesita ?conos din?micos extra para su sidebar, pod?s extender el set base sin tocar la implementaci?n interna de la librer?a:

```typescript
import { ApplicationConfig } from '@angular/core';
import { LucidePackage, LucideUsers } from '@lucide/angular';
import { provideInventarioUi } from 'inventario-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideInventarioUi({
      icons: [LucidePackage, LucideUsers]
    })
  ]
};
```

Importante: `provideInventarioUi()` recibe opciones, no una lista libre de argumentos. La forma correcta para registrar ?conos extra es:

```typescript
provideInventarioUi({
  icons: [LucideHome, LucideLogOut]
})
```

### 4. Definir la configuración del sidebar

```typescript
// app.config.ts o app.routes.ts
import { BarraLateralConfig } from 'inventario-ui';

export const SIDEBAR_CONFIG: BarraLateralConfig = {
  titulo: 'MI MÓDULO',
  subtitulo: 'FICHA 0000000',   // opcional
  logoUrl: 'assets/logo.png',   // opcional — si no se pasa muestra ícono genérico
  grupos: [
    {
      etiqueta: 'Panel Principal',
      items: [
        { label: 'Dashboard', ruta: '/dashboard', icono: 'layout-dashboard' }
      ]
    },
    {
      etiqueta: 'Mi Sección',
      items: [
        { label: 'Lista',   ruta: '/lista',   icono: 'list' },
        { label: 'Alertas', ruta: '/alertas', icono: 'triangle-alert', insignia: 5, insigniaAlerta: true }
      ]
    }
  ]
};
```

### 5. Configurar las rutas con MainLayout como shell

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { MainLayoutComponent } from 'inventario-ui';
import { SIDEBAR_CONFIG } from './app.config';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    // Pasar la config al componente mediante inputs de la ruta
    // (ver paso 6 para la forma recomendada con providers o token)
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
```

### 6. Pasar la config al MainLayoutComponent

En el `app.component.html` del micro-frontend:

```html
<!-- app.component.html -->
<router-outlet></router-outlet>
```

O si usás `MainLayoutComponent` directamente con `@Input()` desde el template raíz:

```html
<lib-main-layout
  [sidebarConfig]="sidebarConfig"
  [perfil]="{ nombre: 'Juan', avatarUrl: 'assets/avatar.png' }"
  buscarPlaceholder="Buscar en mi módulo..."
>
</lib-main-layout>
```

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { MainLayoutComponent, BarraLateralConfig } from 'inventario-ui';
import { SIDEBAR_CONFIG } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainLayoutComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  sidebarConfig: BarraLateralConfig = SIDEBAR_CONFIG;
}
```

### 7. Las vistas solo necesitan su contenido

```html
<!-- cualquier-vista.component.html -->
<!-- NO incluir barra lateral ni barra superior — ya vienen del MainLayout -->
<div>
  <h1>Mi Vista</h1>
</div>
```

---

## Tipos exportados

```typescript
import {
  BarraLateralConfig,  // config completa del sidebar
  NavGrupo,            // grupo de navegación con etiqueta e items
  NavItem,             // ítem individual: label, ruta, icono, insignia
  PerfilConfig         // nombre y avatarUrl del usuario
} from 'inventario-ui';
```

### `NavItem`

| Propiedad | Tipo | Requerido | Descripción |
|---|---|---|---|
| `label` | `string` | ✅ | Texto del enlace |
| `ruta` | `string` | ✅ | Path de la ruta Angular |
| `icono` | `string` | ✅ | Nombre del ícono Lucide |
| `insignia` | `number` | ❌ | Número en el badge |
| `insigniaAlerta` | `boolean` | ❌ | Badge en rojo si es `true` |

---

## Tamaños fijos (no modificar)

| Elemento | Valor |
|---|---|
| Barra lateral (ancho) | `16rem` / 256px |
| Barra superior (alto) | `4rem` / 64px |
| Contenido margin-left | `16rem` / 256px |
| Contenido padding-top | `6rem` / 96px |
| Color primario SENA | `#39A900` |
| Fuente titulares | Manrope 600 / 700 / 800 |
| Fuente cuerpo | Inter 400 / 500 / 600 / 700 |
| Iconos | Lucide Angular + Material Symbols Outlined |
