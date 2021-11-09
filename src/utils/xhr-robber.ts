import { proxy } from 'ajax-hook';

import { Routing } from '@/types';
import { equalPath, routeParser } from '@/utils/route-parser';
import { ORIGINAL_HEADER } from '@/constant';

export const xhrRobber = (status: boolean) => (routines: Routing[], ignorePaths: string[]) => {
    proxy({
        onRequest: (config, handler) => {
            if (!status) return handler.next(config);
            const url = config.url;
            if (ignorePaths.some((itm) => equalPath(itm, url))) return handler.next(config);
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
