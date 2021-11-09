// TODO TS
const injectScript = () => {
    const spy = chrome.runtime.getURL('./js/spy.js');
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', spy);
    document.documentElement.append(script);
};

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    if (message?.type === 'MESSAGE_BEGIN_ROBBER') {
        document.dispatchEvent(new CustomEvent('SPY_CUSTOM_EVENT', { detail: message.data }));
    }
});

injectScript();
