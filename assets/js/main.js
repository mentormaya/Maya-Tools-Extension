function findLinks(tabID){
    console.log('finding links in the content...');
    chrome.action.setBadgeText({
        'tabId': tabID,
        'text': '...'
    });
}

console.log('Main JS loaded!')