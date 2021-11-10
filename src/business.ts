import { CorsDomain, HostageConfig, Protocol } from '@/types';
import { setConfig, getConfig, getCurrentDomain, setCurrentDomain } from '@/storage';
import { postSetCors, postSetRobber } from '@/message';

const postRequestRobber = async (hostageConfig: HostageConfig) => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs?.[0].id) {
        postSetRobber(tabs[0].id, hostageConfig);
    }
};

const postDomainCORS = (domains: CorsDomain[]) => {
    if (domains.length === 0) return;
    postSetCors(chrome.runtime.id, domains);
};

const saveCurrentConfig = async (filterConfig: HostageConfig) => {
    const domainConfig = await getCurrentDomain();
    if (domainConfig) {
        const currentConfig = await getConfig();
        await setConfig({ ...currentConfig, [domainConfig?.domainWithProtocol]: filterConfig });
    }
};

const flushDomainCors = async () => {
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
    ],
    redirect: [
        {
            required: true,
            message: 'Please input Target Host',
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

export const toggleSwitch = async (value: boolean, filterConfig: HostageConfig) => {
    document.documentElement.dataset.theme = value ? 'dark' : 'light';
    await saveCurrentConfig(filterConfig);
    await flushDomainCors();
    if (value) {
        await postRequestRobber(filterConfig);
    }
};

export const init = async () => {
    const result = await getCurrentConfig();
    document.documentElement.dataset.theme = result?.status ? 'dark' : 'light';
};
