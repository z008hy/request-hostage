import { proxy } from 'ajax-hook';

import { Routing } from '@/types';
import { matchPath, routeParser } from '@/utils/route-parser';
import { ORIGINAL_HEADER } from '@/constant';

export const xhrRobber = (routines: Routing[], ignorePaths: string[]) => {
    proxy({
        onRequest: (config, handler) => {
            const url = config.url;
            if (matchPath(url, ignorePaths)) return handler.next(config);
            const parseResult = routeParser(url, routines);
            if (!parseResult) return handler.next(config);
            handler.next({
                ...config,
                url: parseResult,
                headers: { ...config.headers, [ORIGINAL_HEADER]: config.url },
            });
        },
        onError: (err, handler) => {
            handler.next(err);
        },
        onResponse: (response, handler) => {
            handler.next(response);
        },
    });
};
