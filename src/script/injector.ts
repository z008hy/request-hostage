import { MESSAGE_BEGIN_ROBBER, SPY_CUSTOM_EVENT, MESSAGE_SPY_LOADED } from '@/constant';
import { postSpyLoad } from '@/message';

const injectScript = () => {
    const spy = chrome.runtime.getURL('./spy.js');
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', spy);
    document.documentElement.append(script);
    script.addEventListener('load', () => {
        postSpyLoad(chrome.runtime.id, true);
    });
};

// 监听开始执行拦截
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    if (message?.type === MESSAGE_BEGIN_ROBBER) {
        document.dispatchEvent(new CustomEvent(SPY_CUSTOM_EVENT, { detail: message.data }));
    }
});

injectScript();
