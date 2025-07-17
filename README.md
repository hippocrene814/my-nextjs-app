# Museum App

A cross-platform museum application with web and mobile platforms, built with Next.js and React Native.

## Project Structure

```
my-nextjs-app/
├── apps/
│   ├── web/                 # Next.js web application
│   └── mobile/              # React Native mobile app
├── packages/
│   └── shared/              # Shared library (models, API, utils)
├── package.json             # Root workspace configuration
└── README.md
```

## Quick Start

### Install Dependencies
```bash
npm install
```

### Development

**Web Platform:**
```bash
npm run dev --workspace=web
```

**Mobile Platform:**
```bash
npm run dev --workspace=mobile
```

### Build

**Web Platform:**
```bash
npm run build --workspace=web
```

**Shared Library:**
```bash
npm run build --workspace=shared
```

## Apps & Packages

### Web App (`apps/web/`)
- **Framework**: Next.js 15.x with React 19
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js
- **Backend**: Firebase
- **Features**: Museum browsing, search, user authentication, wishlist, visited list

### Mobile App (`apps/mobile/`)
- **Framework**: React Native 0.80.x
- **Platforms**: Android (Kotlin) + iOS (Swift)
- **Features**: Museum browsing, search, visited list, wish list

### Shared Package (`packages/shared/`)
- **Purpose**: Code sharing between web and mobile apps
- **Content**: Models, API functions, utilities, constants
- **Usage**: Imported as `@museum-app/shared` in both apps
- **Key API**: `fetchMuseumsByIds(ids: string[])` for efficient batch museum data fetching (used by both web and mobile)

## Development Workflow

1. **Shared Code**: Add models, API functions, and utilities to `packages/shared/`
2. **Web Development**: Work in `apps/web/` for web-specific features
3. **Mobile Development**: Work in `apps/mobile/` for mobile-specific features
4. **Cross-Platform**: Use the shared package for common functionality

## Available Scripts

- `npm run dev --workspace=web` - Start web development server
- `npm run dev --workspace=mobile` - Start React Native Metro bundler
- `npm run build --workspace=web` - Build web application
- `npm run build --workspace=shared` - Build shared library
- `npm run lint --workspace=web` - Lint web platform code
- `npm run lint --workspace=mobile` - Lint mobile platform code
- `npm run install:all` - Install all dependencies
- `npm run clean` - Clean all node_modules

## Technology Stack

- **Frontend**: React 19, Next.js 15.x, React Native 0.80.x
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js
- **Backend**: Firebase
- **Language**: TypeScript
- **Package Manager**: npm with workspaces

## Shared API Usage Example

Both web and mobile use the following shared API for efficient museum data fetching:

```ts
import { fetchMuseumsByIds } from '@museum-app/shared/api/museums';

const museums = await fetchMuseumsByIds([id1, id2, id3]);
```

This enables both platforms to fetch multiple museums in a single request, improving performance and code maintainability.
