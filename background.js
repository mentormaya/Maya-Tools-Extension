chrome.tabs.onUpdated.addListener(async (tabId, changeInFo, tab) => {
  // console.log(tabID, ' Tab Updated as ', changeInFo)
  if (
    tab.url?.startsWith("chrome://") ||
    tab.url?.startsWith("chrome-extension://")
  )
    return undefined;
  if (changeInFo.status === "complete") {
    console.log("Page Reloaded!\nLoading main.js");
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["assets/js/main.js"],
    });
  }
});

chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    console.log("Video Downloader Installed Successfully!");
    chrome.tabs.create({
      url: "welcome.html",
    });
  }
});

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  let is_chrome_page = (sender.origin.includes('chrome://') || sender.origin.includes('chrome-extension://'))
  if (req.status && req.status == "..." && !is_chrome_page) {
    console.log(`finding links in the content...`)
    chrome.action.setBadgeText({
      tabId: sender.tab.id,
      text: "...",
    });
  }

  if (req.total_video && !is_chrome_page){
    console.log(`setting badge to '${req.total_video}'`)
    chrome.action.setBadgeText({
      tabId: sender.tab.id,
      text: `${req.total_video}`
    });
  }
});
