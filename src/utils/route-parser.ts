import URI from 'urijs';

import { Routing } from '@/types';

const matchPath = (url: string, userFilterPath: string) => {
    const { hostname, path } = URI.parse(url);
    const { hostname: filterHost, path: filterPath } = URI.parse(userFilterPath);
    // 命中
    return !!(hostname === filterHost && path?.includes(filterPath || ''));
};

const resolvePath = (url: string, target: string): string => {
    const { path } = URI.parse(url);
    return `${URI(target).toString()}${path}`;
};

export const routeParser = (url: string, routing: Routing[]): string => {
    const matchRoute = routing.find((routing) => matchPath(url, routing.route));
    if (!matchRoute) return '';
    return resolvePath(url, matchRoute?.redirect || '') || '';
};

export const equalPath = (a: string, b: string) => {
    return URI(a).equals(b);
};
