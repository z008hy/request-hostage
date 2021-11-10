import { HostageConfig } from '@/types';
import { SPY_CUSTOM_EVENT } from '@/constant';
import { xhrRobber } from '@/utils/xhr-robber';

const process = (config: HostageConfig) => {
    const { status, ignore } = config;
    const ignorePaths = [ignore].filter((item) => item);
    const routines = [{ ...config }].filter((itm) => itm.route && itm.redirect);
    xhrRobber(status)(routines, ignorePaths);
};

document.addEventListener(SPY_CUSTOM_EVENT, (config) => {
    const messageConfig = config as CustomEvent;
    if (messageConfig?.detail) process(messageConfig?.detail);
});
