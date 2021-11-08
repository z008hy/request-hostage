// @ts-ignore
import * as url from 'url';

import { CorsDomain, HostageConfig, SecretMessage } from '@/types';
import { CONFIG_STORAGE_KEY, DOMAINS_STORAGE_KEY } from '@/constant';

const getDomainConfig = async (): Promise<CorsDomain | undefined> => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tabs?.[0]?.url;
    if (!currentUrl) return;
    return {
        protocol: url('protocol', currentUrl),
        domain: url('hostname', currentUrl),
        domainWithProtocol: `${url('protocol', currentUrl)}://${url('hostname', currentUrl)}`,
    };
};

const saveActionDomain = async (domain: CorsDomain) => {
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

const setDomainCORS = (domains: CorsDomain[]) => {
    if (domains.length === 0) return;
    const postMessage: SecretMessage<CorsDomain[]> = {
        type: 'MODIFY_CORS',
        data: domains,
    };
    chrome.runtime.sendMessage(chrome.runtime.id, postMessage, (message: string) => {
        if (message) console.warn(message);
    });
};

const saveConfig = (filterConfig: HostageConfig) => {
    return chrome.storage.local.set({ [CONFIG_STORAGE_KEY]: filterConfig });
};

export const toggleSwitch = async (value: boolean, filterConfig: HostageConfig) => {
    document.documentElement.dataset.theme = value ? 'dark' : 'light';
    await saveConfig(filterConfig);
    const domain = await getDomainConfig();
    if (!domain) return;
    const domains = await saveActionDomain(domain);
    setDomainCORS(domains);
};
