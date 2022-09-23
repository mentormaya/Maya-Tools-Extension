import { findLinks } from './assets/js/main.js'

// chrome.tabs.onActivated.addListener(async ({tabID, windowID}) => {
//   console.log(tabID, ' Tab Activated')
// });

chrome.tabs.onUpdated.addListener(async (tabID, changeInFo, tab) => {
  // console.log(tabID, ' Tab Updated as ', changeInFo)
  if (changeInFo.status === 'complete'){
    console.log('Page Reloaded!')
    findLinks(tabID);
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
