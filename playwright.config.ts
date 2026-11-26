import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env['CI']);
const port = 4173;

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${String(port)}/puzzle-game/`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  // Test the production build, served under the same base path as GitHub Pages.
  webServer: {
    command: `pnpm build && pnpm preview --port ${String(port)} --strictPort`,
    url: `http://localhost:${String(port)}/puzzle-game/`,
    reuseExistingServer: !isCI,
  },
});
