# Museum App

A cross-platform museum application with web and mobile platforms, built with Next.js and React Native.

## Project Structure

```
museum-app/
├── platforms/
│   ├── web/                 # Next.js web application
│   ├── mobile/              # React Native mobile app
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
npm run dev:web
```

**Mobile Platform:**
```bash
npm run dev:mobile
```

### Build

**Web Platform:**
```bash
npm run build:web
```

**Shared Library:**
```bash
npm run build:shared
```

## Platforms

### Web Platform (`platforms/web/`)
- **Framework**: Next.js 15.3.4 with React 19
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js
- **Backend**: Firebase
- **Features**: Museum browsing, search, user authentication, wishlist

### Mobile Platform (`platforms/mobile/`)
- **Framework**: React Native 0.80.1
- **Platforms**: Android (Kotlin) + iOS (Swift)
- **Status**: Basic setup, ready for feature implementation

### Shared Library (`platforms/shared/`)
- **Purpose**: Code sharing between web and mobile platforms
- **Content**: Models, API functions, utilities, constants
- **Usage**: Imported as `@museum-app/shared` in both platforms

## Development Workflow

1. **Shared Code**: Add models, API functions, and utilities to `platforms/shared/`
2. **Web Development**: Work in `platforms/web/` for web-specific features
3. **Mobile Development**: Work in `platforms/mobile/` for mobile-specific features
4. **Cross-Platform**: Use shared library for common functionality

## Available Scripts

- `npm run dev:web` - Start web development server
- `npm run dev:mobile` - Start React Native Metro bundler
- `npm run build:web` - Build web application
- `npm run build:shared` - Build shared library
- `npm run lint:web` - Lint web platform code
- `npm run lint:mobile` - Lint mobile platform code
- `npm run install:all` - Install all dependencies
- `npm run clean` - Clean all node_modules

## Technology Stack

- **Frontend**: React 19, Next.js 15.3.4, React Native 0.80.1
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js
- **Backend**: Firebase
- **Language**: TypeScript
- **Package Manager**: npm with workspaces
