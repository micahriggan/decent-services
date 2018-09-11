export declare class BaseClient {
    private serviceName;
    private envClient;
    private servicePromise;
    private service;
    constructor(serviceName: any, envUrl?: string);
    getUrl(): Promise<string>;
}
