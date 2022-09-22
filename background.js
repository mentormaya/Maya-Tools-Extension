let color = '#c1c1c1';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %gray', `color: ${color}`);
});
