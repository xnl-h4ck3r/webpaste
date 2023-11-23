chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                // Modify the condition as needed, e.g., to activate on a specific domain
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});