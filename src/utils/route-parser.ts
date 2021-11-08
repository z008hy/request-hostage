import { match } from 'path-to-regexp';

import { Routing } from '@/types';

export const routeParser = (path: string, routing: Routing[]): string => {
    const matchRoute = routing.find((routing) =>
        match(routing.route, { decode: decodeURIComponent })(path),
    );
    return matchRoute?.redirect || '';
};

export const matchPath = (path: string, paths: string[]) => {
    const matchResult = paths.find((matchPath) =>
        match(matchPath, { decode: decodeURIComponent })(path),
    );
    return !!matchResult;
};
