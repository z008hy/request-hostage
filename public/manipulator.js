// TODO TS

const createCorsHeaders = (host) => [
    {
        header: 'Access-Control-Allow-Origin',
        operation: 'set',
        value: host,
    },
    {
        header: 'Access-Control-Allow-Credentials',
        operation: 'set',
        value: 'true',
    },
    {
        header: 'Access-Control-Allow-Methods',
        operation: 'set',
        value: 'GET, PUT, DELETE, POST, OPTIONS',
    },
];

const createUpdateRulesOption = async (modifyDomains) => {
    const currentDomains = await chrome.declarativeNetRequest.getDynamicRules();
    const removeRuleIds = currentDomains.map((cd) => cd.id);
    const addRules = modifyDomains.map((md, idx) => ({
        priority: 1,
        id: idx + 1,
        condition: {
            domains: [md.domain],
            resourceTypes: ['xmlhttprequest', 'sub_frame'],
        },
        action: {
            type: 'modifyHeaders',
            responseHeaders: createCorsHeaders(md.domainWithProtocol),
        },
    }));
    return {
        removeRuleIds,
        addRules,
    };
};

chrome.runtime.onMessage.addListener(async (message, _sender, _sendResponse) => {
    if (message && message.type === 'MODIFY_CORS') {
        const updateRulesOption = await createUpdateRulesOption(message.data);
        await chrome.declarativeNetRequest.updateDynamicRules(updateRulesOption);
    }
});
