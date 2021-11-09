import URI from 'urijs';

import { CONFIG_STORAGE_KEY, DOMAINS_STORAGE_KEY } from '@/constant';
import { CorsDomain, HostageConfig } from '@/types';

export const getConfig = async (): Promise<undefined | Record<string, HostageConfig>> => {
    const currentConfig = await chrome.storage.local.get([CONFIG_STORAGE_KEY]);
    return currentConfig?.[CONFIG_STORAGE_KEY];
};

export const setConfig = async (data: Record<string, HostageConfig>) => {
    return chrome.storage.local.set({ [CONFIG_STORAGE_KEY]: data });
};

export const getCurrentDomain = async (): Promise<CorsDomain | undefined> => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tabs?.[0]?.url;
    if (!currentUrl) return;
    const result = URI.parse(currentUrl);
    return {
        protocol: result.protocol || '',
        domain: result.hostname || '',
        domainWithProtocol: `${result.protocol}://${result.hostname}`,
    };
};

export const setCurrentDomain = async (domain: CorsDomain) => {
    const domains = await chrome.storage.local.get([DOMAINS_STORAGE_KEY]);
    if (Array.isArray(domains?.[DOMAINS_STORAGE_KEY])) {
        domains[DOMAINS_STORAGE_KEY].push(domain);
        await chrome.storage.local.set({
            [DOMAINS_STORAGE_KEY]: domains[DOMAINS_STORAGE_KEY],
        });
    } else {
        await chrome.storage.local.set({
            [DOMAINS_STORAGE_KEY]: [domain],
        });
    }
    const updatedDomains = await chrome.storage.local.get([DOMAINS_STORAGE_KEY]);
    return updatedDomains?.[DOMAINS_STORAGE_KEY] || [];
};
