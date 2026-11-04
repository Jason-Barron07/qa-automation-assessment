export interface IUiSettings
{
    baseUrl: string;
    actionTimeoutMs: number;
    navigationTimeoutMs: number;
}

export interface IRunnerSettings
{
    testTimeoutMs: number;
    expectTimeoutMs: number;
    workers: number;
    ciRetries: number;
    isCi: boolean;
}

export interface IEnvironmentSettings
{
    ui: IUiSettings;
    runner: IRunnerSettings;
}

export interface ICredentials
{
    username: string;
    password: string;
}
