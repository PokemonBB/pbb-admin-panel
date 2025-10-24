# PBB Admin Panel

Panel de administración para PokemonBattleBrawl (PBB) construido con SvelteKit.

## Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# API Configuration
PUBLIC_API_BASE_URL=http://localhost:3000/api
PUBLIC_CDS_BASE_URL=http://localhost:3003/api

# Development Configuration
PUBLIC_APP_TITLE=PBB Admin Panel
```

### Desarrollo

Instala las dependencias:

```sh
yarn install
```

Inicia el servidor de desarrollo:

```sh
yarn dev
```

La aplicación estará disponible en `http://localhost:3002`

### Variables de Entorno por Entorno

**Desarrollo:**

```env
PUBLIC_API_BASE_URL=http://localhost:3000/api
PUBLIC_CDS_BASE_URL=http://localhost:3003/api
```

**Producción:**

```env
PUBLIC_API_BASE_URL=https://api.pokemonbb.com/api
PUBLIC_CDS_BASE_URL=http://localhost:3003/api
```

### Build

Para crear la versión de producción:

```sh
yarn build
```

Los archivos estáticos se generarán en la carpeta `build/`

### Preview

Para previsualizar el build de producción:

```sh
yarn preview
```

## Tecnologías

- **SvelteKit**: Framework principal
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos con plugins de typography y forms
- **Adaptador Estático**: Generación de archivos estáticos
