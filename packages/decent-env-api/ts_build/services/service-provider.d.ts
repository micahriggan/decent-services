import { Service } from 'decent-env-client';
export declare class DecentEnvProvider {
    register(service: Service): Promise<Service>;
    get(serviceName: any): Service;
}
