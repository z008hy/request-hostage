function injectScript() {
    const spy = chrome.runtime.getURL('./js/spy.js');
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', spy);
    document.documentElement.append(script);
}

injectScript();
