import { CorsDomain } from '@/types';
import { MESSAGE_MODIFY_CORS, MESSAGE_SPY_LOADED } from '@/constant';
import { postSetRobber } from '@/message';
import { getConfigByDomain, getCorsDomainConfig, getDomain } from '@/storage';

const createCorsHeaders = (host: string): chrome.declarativeNetRequest.ModifyHeaderInfo[] => [
    {
        header: 'Access-Control-Allow-Origin',
        operation: chrome.declarativeNetRequest.HeaderOperation.SET,
        value: host,
    },
    {
        header: 'Access-Control-Allow-Credentials',
        operation: chrome.declarativeNetRequest.HeaderOperation.SET,
        value: 'true',
    },
    {
        header: 'Access-Control-Allow-Methods',
        operation: chrome.declarativeNetRequest.HeaderOperation.SET,
        value: 'GET, PUT, DELETE, POST, OPTIONS',
    },
];

const createUpdateRulesOption = async (
    modifyDomains: CorsDomain[],
): Promise<chrome.declarativeNetRequest.UpdateRuleOptions> => {
    const currentDomains = await chrome.declarativeNetRequest.getDynamicRules();
    const removeRuleIds = currentDomains.map((cd) => cd.id);
    const addRules = modifyDomains.map((md, idx) => ({
        priority: 1,
        id: idx + 1,
        condition: {
            domains: [md.domain],
            resourceTypes: [
                chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
                chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
            ],
        },
        action: {
            type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
            responseHeaders: createCorsHeaders(md.domainWithProtocol),
        },
    }));
    return {
        removeRuleIds,
        addRules,
    };
};

const postModifyCorsDomain = async (data: CorsDomain[]) => {
    const updateRulesOption = await createUpdateRulesOption(data);
    return chrome.declarativeNetRequest.updateDynamicRules(updateRulesOption);
};

const postInitSpy = async (data: boolean, sender: chrome.runtime.MessageSender) => {
    const tabId = sender.tab?.id;
    const url = sender.tab?.url;
    if (tabId && url) {
        const domain = await getDomain(url);
        const domainConfig = await getConfigByDomain(domain);
        const corsDomains = await getCorsDomainConfig();
        if (corsDomains) postModifyCorsDomain(corsDomains);
        if (domainConfig) postSetRobber(tabId, domainConfig);
    }
};

chrome.runtime.onMessage.addListener(async (message: any, sender, _sendResponse) => {
    // 开始执行 CORS
    if (message && message.type === MESSAGE_MODIFY_CORS) {
        return postModifyCorsDomain(message.data);
    }
    // 监听 spy 加载
    if (message && message.type === MESSAGE_SPY_LOADED) {
        return postInitSpy(message.data, sender);
    }
});
