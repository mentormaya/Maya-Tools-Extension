// chrome.tabs.onActivated.addListener(async ({tabID, windowID}) => {
//   console.log(tabID, ' Tab Activated')
// });

chrome.tabs.onUpdated.addListener(async (tabId, changeInFo, tab) => {
  // console.log(tabID, ' Tab Updated as ', changeInFo)
  if (changeInFo.status === 'complete'){
    console.log('Page Reloaded!')
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      files: ['./assets/js/main.js'],
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
