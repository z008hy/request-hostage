import { CorsDomain, HostageConfig } from '@/types';
import { MESSAGE_BEGIN_ROBBER, MESSAGE_SPY_LOADED, MESSAGE_MODIFY_CORS } from '@/constant';

/**
 * 开始设置 Cors
 * 发起者 receiver
 * 接受者 manipulator
 */
export const postSetCors = (runtimeId: string, data: CorsDomain[]) => {
    chrome.runtime.sendMessage(runtimeId, {
        type: MESSAGE_MODIFY_CORS,
        data,
    });
};

/**
 * 开始设置代理
 * 发起者  manipulator / receiver
 * 接受者 injector
 */
export const postSetRobber = (tabId: number, data: HostageConfig) => {
    chrome.tabs.sendMessage(tabId, {
        type: MESSAGE_BEGIN_ROBBER,
        data,
    });
};

/**
 * spy 就绪
 * 发起者 injector
 * 接受者 manipulator
 */
export const postSpyLoad = (runtimeId: string, data: boolean) => {
    return chrome.runtime.sendMessage(runtimeId, {
        type: MESSAGE_SPY_LOADED,
        data,
    });
};
