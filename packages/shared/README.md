# Museum App Shared Package

This package contains shared types, models, and utilities used by both the web and mobile applications.

## Structure

- `models/` - TypeScript interfaces and types
- `api/` - API functions for data fetching
- `utils/` - Shared constants and utilities

## Usage

```typescript
// Import everything
import { Museum, fetchMuseums, API_CONSTANTS } from '@museum-app/shared';

// Or import specific items
import { Museum } from '@museum-app/shared/models/Museum';
import { fetchMuseums } from '@museum-app/shared/api/museums';
```

## Development

```bash
# Type check
npm run type-check

# Build
npm run build
``` 