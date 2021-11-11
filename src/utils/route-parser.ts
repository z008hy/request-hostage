import URI from 'urijs';

import { HostageConfig } from '@/types';

const matchPath = (url: string, userFilterPath: string) => {
    const { hostname, path } = URI.parse(url);
    const { hostname: filterHost, path: filterPath } = URI.parse(userFilterPath);
    // 命中
    return !!(hostname === filterHost && path?.includes(filterPath || ''));
};

const resolvePath = (url: string, routing: HostageConfig): string => {
    const { path: urlPath, query: urlQuery } = URI.parse(url);
    const { path: routePath } = URI.parse(`${routing.routeProtocol}://${routing.route}`);
    const mergePath = urlPath?.slice(routePath?.length || 0) || 0;
    const uriWithProtocol = URI(`${routing.redirectProtocol}://${routing.redirect}`);
    const query = urlQuery ? `?${urlQuery}` : '';
    return `${uriWithProtocol.toString()}/${mergePath}${query}`
        .split('/')
        .filter((it) => it)
        .join('/');
};

export const routeParser = (url: string, routing: HostageConfig[]): string => {
    const matchRoute = routing.find((routing) =>
        matchPath(url, `${routing.routeProtocol}://${routing.route}`),
    );
    if (!matchRoute) return '';
    return resolvePath(url, matchRoute) || '';
};

export const equalPath = (a: string, b: string) => {
    return URI(a).equals(b);
};
