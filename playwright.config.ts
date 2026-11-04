import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { getEnvironmentSettings } from './src/config/environment.js';

const settings = getEnvironmentSettings();

const uiTestDir = defineBddConfig({
    features: 'tests/ui/**/*.feature',
    steps: ['tests/ui/**/*.steps.ts', 'src/fixtures/ui.fixture.ts'],
    outputDir: '.features-gen/ui'
});

export default defineConfig({
    fullyParallel: true,
    forbidOnly: settings.runner.isCi,
    retries: settings.runner.isCi ? settings.runner.ciRetries : 0,
    workers: settings.runner.workers,
    timeout: settings.runner.testTimeoutMs,
    expect: { timeout: settings.runner.expectTimeoutMs },
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['junit', { outputFile: 'junit-report/results.xml' }]
    ],
    use: {
        actionTimeout: settings.ui.actionTimeoutMs,
        navigationTimeout: settings.ui.navigationTimeoutMs,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure'
    },
    projects: [
        {
            name: 'ui-chromium',
            testDir: uiTestDir,
            use: {
                ...devices['Desktop Chrome'],
                baseURL: settings.ui.baseUrl,
                testIdAttribute: 'data-test'
            }
        }
    ]
});
