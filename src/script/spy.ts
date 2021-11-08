import { HostageConfig } from '@/types';
import { xhrRobber } from '@/utils/xhr-robber';
import { CONFIG_STORAGE_KEY } from '@/constant';

const getConfig = (): HostageConfig => {
    const defaultConfig = {
        status: false,
        route: '',
        redirect: '',
        ignore: '',
    };
    try {
        const result = JSON.parse((window as any).localStorage[CONFIG_STORAGE_KEY]);
        if (typeof result?.status === 'boolean') return result;
        return defaultConfig;
    } catch (error) {
        console.warn('Parse STORAGE_KEY error', error);
        return defaultConfig;
    }
};

const process = () => {
    (window as any)['USE_HOSTAGE'] = true;
    const { status, route, redirect, ignore } = getConfig();
    if (!status) return;
    const ignorePaths = [ignore].filter((item) => item);
    const routines = [{ route, redirect }].filter((itm) => itm.route && itm.redirect);
    xhrRobber(routines, ignorePaths);
};

process();
