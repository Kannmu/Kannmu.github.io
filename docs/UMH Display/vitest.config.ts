import { defineConfig } from 'vitest/config';

// The app lives under web/ (Vite root) while the fixtures and the Python oracle
// live at the project root, so tests run from the root, not from web/.
export default defineConfig({
  test: {
    root: '.',
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000
  }
});
