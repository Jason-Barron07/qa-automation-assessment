import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import type { ICredentials, IEnvironmentSettings } from './environment.types.js';

// Existing process variables win, then .env, then the selected environment file.
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true });
const targetEnvironment = process.env.TARGET_ENVIRONMENT ?? 'qa';
if (!/^[a-z0-9-]+$/i.test(targetEnvironment))
{
    throw new Error('TARGET_ENVIRONMENT must be a simple environment name.');
}
dotenv.config({ path: fileURLToPath(new URL(`../../.env.${targetEnvironment}`, import.meta.url)), quiet: true });

/**
 * Validates configuration once before tests are constructed.
 * @returns Environment-specific UI and runner settings.
 */
export function getEnvironmentSettings(): IEnvironmentSettings
{
    return {
        ui: {
            baseUrl: requiredUrl('UI_BASE_URL'),
            actionTimeoutMs: requiredInteger('UI_ACTION_TIMEOUT_MS'),
            navigationTimeoutMs: requiredInteger('UI_NAVIGATION_TIMEOUT_MS')
        },
        runner: {
            testTimeoutMs: requiredInteger('TEST_TIMEOUT_MS'),
            expectTimeoutMs: requiredInteger('EXPECT_TIMEOUT_MS'),
            workers: requiredInteger('TEST_WORKERS'),
            ciRetries: requiredInteger('CI_RETRIES', 0),
            isCi: Boolean(process.env.CI)
        }
    };
}

function requiredUrl(name: string): string
{
    const value = process.env[name];
    if (!value)
    {
        throw new Error(`${name} is required. Configure it in .env or .env.${targetEnvironment}.`);
    }
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol))
    {
        throw new Error(`${name} must be an HTTP or HTTPS URL.`);
    }
    return url.href;
}

function requiredInteger(name: string, minimum: number = 1): number
{
    const raw = process.env[name];
    const value = Number(raw);
    if (raw === undefined || raw.trim() === '' || !Number.isSafeInteger(value) || value < minimum)
    {
        throw new Error(`${name} must be an integer greater than or equal to ${minimum}.`);
    }
    return value;
}

/**
 * Loads credentials from the local environment without storing them in test data.
 * @returns Login credentials for the demo account.
 */
export function getCredentials(): ICredentials
{
    const username = process.env.SWAG_USERNAME;
    const password = process.env.SWAG_PASSWORD;
    if (!username || !password)
    {
        throw new Error('Set SWAG_USERNAME and SWAG_PASSWORD in the ignored .env file.');
    }
    return { username, password };
}
