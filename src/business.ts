import { CorsDomain, HostageConfig, SecretMessage } from '@/types';
import { MESSAGE_BEGIN_ROBBER, MESSAGE_MODIFY_CORS } from '@/constant';
import { setConfig, getConfig, getCurrentDomain, setCurrentDomain } from '@/storage';

const postRequestRobber = async (hostageConfig: HostageConfig) => {
    const postMessage: SecretMessage<HostageConfig> = {
        type: MESSAGE_BEGIN_ROBBER,
        data: hostageConfig,
    };
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs?.[0].id) {
        chrome.tabs.sendMessage(tabs?.[0].id, postMessage, (message: string) => {
            if (message) console.warn(message);
        });
    }
};

const postDomainCORS = (domains: CorsDomain[]) => {
    if (domains.length === 0) return;
    const postMessage: SecretMessage<CorsDomain[]> = {
        type: MESSAGE_MODIFY_CORS,
        data: domains,
    };
    chrome.runtime.sendMessage(chrome.runtime.id, postMessage, (message: string) => {
        if (message) console.warn(message);
    });
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
