export declare type Service = {
    name: string;
    host?: string;
    url?: string;
    port?: number | string;
    data?: any;
};
export declare const EnvConstants: {
    web3: {
        url: string;
    };
    DECENT_ENV_PORT: string | number;
    DECENT_ENV_HOST: string;
};
export declare class DecentEnvClient {
    private url;
    constructor(url?: string);
    register(service: Service): Promise<Service>;
    get(serviceName: string): Promise<Service>;
}
export * from './base';
