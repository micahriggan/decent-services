export declare class BaseClient {
    private serviceName;
    private envClient;
    private servicePromise;
    private service;
    constructor(envUrl: any, serviceName: any);
    getUrl(): Promise<string>;
}
