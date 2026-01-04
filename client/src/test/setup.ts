import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically unmounts React components after each test to prevent memory leaks
afterEach(() => {
  cleanup();
});