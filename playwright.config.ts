import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)), quiet: true });

const apiTestDir = defineBddConfig({
    features: 'tests/api/**/*.feature',
    steps: ['tests/api/**/*.steps.ts', 'tests/api/**/*.fixture.ts'],
    outputDir: '.features-gen/api'
});

const uiTestDir = defineBddConfig({
    features: 'tests/ui/**/*.feature',
    steps: ['tests/ui/**/*.steps.ts', 'tests/ui/**/*.fixture.ts'],
    outputDir: '.features-gen/ui'
});

export default defineConfig({
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    workers: 1,
    timeout: 30_000,
    expect: { timeout: 5_000 },
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['junit', { outputFile: 'junit-report/results.xml' }]
    ],
    use: {
        actionTimeout: 10_000,
        navigationTimeout: 30_000,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure'
    },
    projects: [
        {
            name: 'api',
            testDir: apiTestDir,
            use: { baseURL: process.env.API_BASE_URL ?? 'https://catfact.ninja' }
        },
        {
            name: 'ui-chromium',
            testDir: uiTestDir,
            use: {
                ...devices['Desktop Chrome'],
                baseURL: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',
                testIdAttribute: 'data-test'
            }
        }
    ]
});
