export interface HostageConfig {
    route: string;
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
