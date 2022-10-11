// chrome.tabs.onActivated.addListener(async ({tabID, windowID}) => {
//   console.log(tabID, ' Tab Activated')
// });
function getInfo(){
    
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInFo, tab) => {
  // console.log(tabID, ' Tab Updated as ', changeInFo)
  if (tab.url?.startsWith("chrome://") || tab.url?.startsWith("chrome-extension://")) return undefined;
  if (changeInFo.status === 'complete'){
    console.log('Page Reloaded!\nLoading main.js')
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      files: ['assets/js/main.js'],
    });
  }
});

chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    console.log('Video Downloader Installed Successfully!');
    chrome.tabs.create({
      url: 'welcome.html'
    });
  }
});

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse){
  console.log(req.status == "..."  ? `finding links in the content...` : req.status)
  if (req.status == "..."){
    chrome.action.setBadgeText({
      'tabId': sender.tab.tabId,
      'text': '...'
  });
  }
});