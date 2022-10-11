let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

function showLinks(details){
  let expiresIn = details.expiresInSeconds
  let adaptive = details.adaptiveFormats
  let progressive = details.formats

  let total = adaptive.length + progressive.length

  chrome.runtime.sendMessage({total_video: `${adaptive.length}+${progressive.length}`})

  console.log(total)
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.details) {
    console.log(req.status)
    console.log(req.details)
    showLinks(req.details)
  }
});
// Initialize butotn with users's prefered color
// let downloadBtn = document.getElementById("download");

// When the button is clicked, inject setPageBackgroundColor into current page
// downloadBtn.addEventListener("click", async () => {
//   console.log('Downloading... ' + tab.url)
//   if (tab.url && (tab.url.includes('chrome://') || tab.url.includes('chrome-extension://'))){
//     console.log('Chrome Page Showing! Error will trigger')
//     return
//   }

//   if (tab.url && tab.url.includes('youtube.com/watch')){
//     console.log('YouTube Video Link Found!');
//     downloadYouTubeVideo(tab.url);
//   }

//   if (tab.url && tab.url.includes('youtube.com/playlist')){
//     console.log('YouTube Playlist Link Found!');
//     downloadYouTubePlaylist(tab.url);
//   }
// });
