export enum Protocol {
    HTTP = 'http',
    HTTPS = 'https',
}

export interface HostageConfig {
    routeProtocol: Protocol;
    route: string;
    redirectProtocol: Protocol;
    redirect: string;
    status: boolean;
    ignore: string;
}

export interface Routing {
    route: string;
    redirect: string;
}

export interface CorsDomain {
    domain: string;
    protocol: string;
    domainWithProtocol: string;
}

export interface SecretMessage<T> {
    type: string;
    data: T;
}
