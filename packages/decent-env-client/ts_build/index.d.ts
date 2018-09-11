export declare type Service = {
    name: string;
    url: string;
    port?: number;
    data: any;
};
export declare const EnvConstants: {
    web3: {
        url: string;
    };
};
export declare class DecentEnvClient {
    private decentEnvApiUrl;
    constructor(decentEnvApiUrl: string);
    register(service: Service): Promise<Service>;
    get(serviceName: string): Promise<Service>;
}
