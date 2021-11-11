import { CorsDomain, HostageConfig, Protocol } from '@/types';
import { setConfig, getConfig, getCurrentDomain, setCurrentDomain } from '@/storage';
import { postSetCors, postSetRobber } from '@/message';
import { validateHost } from '@/utils/validator';

export const postRequestRobber = async (hostageConfig: HostageConfig) => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs?.[0].id) {
        postSetRobber(tabs[0].id, hostageConfig);
    }
};

export const postDomainCORS = (domains: CorsDomain[]) => {
    if (domains.length === 0) return;
    postSetCors(chrome.runtime.id, domains);
};

export const saveCurrentConfig = async (filterConfig: HostageConfig) => {
    const domainConfig = await getCurrentDomain();
    if (domainConfig) {
        const currentConfig = await getConfig();
        await setConfig({ ...currentConfig, [domainConfig?.domainWithProtocol]: filterConfig });
    }
};

export const flushCurrentConfig = async (filterConfig: HostageConfig) => {
    await saveCurrentConfig(filterConfig);
    return postRequestRobber(filterConfig);
};

export const flushDomainCors = async () => {
    const domain = await getCurrentDomain();
    if (!domain) return;
    const domains = await setCurrentDomain(domain);
    postDomainCORS(domains);
};

export const getDefaultConfigRules = () => ({
    route: [
        {
            required: true,
            message: 'Please input Intercepted Path',
            trigger: 'blur',
        },
        {
            validator: validateHost,
            trigger: 'blur',
        },
    ],
    redirect: [
        {
            required: true,
            message: 'Please input Target Host',
            trigger: 'blur',
        },
        {
            validator: validateHost,
            trigger: 'blur',
        },
    ],
});

export const getDefaultConfig = () => ({
    status: false,
    routeProtocol: Protocol.HTTPS,
    route: '',
    redirect: '',
    redirectProtocol: Protocol.HTTP,
    ignore: '',
});

export const getCurrentConfig = async (): Promise<HostageConfig | undefined> => {
    const domainConfig = await getCurrentDomain();
    if (domainConfig) {
        const currentConfig = await getConfig();
        return currentConfig?.[domainConfig?.domainWithProtocol];
    }
    return undefined;
};

export const switchTheme = (theme: 'dark' | 'light') => {
    document.documentElement.dataset.theme = theme;
};

export const init = async () => {
    const result = await getCurrentConfig();
    document.documentElement.dataset.theme = result?.status ? 'dark' : 'light';
};
