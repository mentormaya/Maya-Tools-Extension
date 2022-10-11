import { downloadYouTubeVideo, downloadYouTubePlaylist } from './assets/js/YouTube.js'

let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

// Initialize butotn with users's prefered color
let downloadBtn = document.getElementById("download");

// When the button is clicked, inject setPageBackgroundColor into current page
downloadBtn.addEventListener("click", async () => {
  console.log('Downloading... ' + tab.url)  
  if (tab.url && (tab.url.includes('chrome://') || tab.url.includes('chrome-extension://'))){
    console.log('Chrome Page Showing! Error will trigger')
    return
  }

  if (tab.url && tab.url.includes('youtube.com/watch')){
    console.log('YouTube Video Link Found!');
    downloadYouTubeVideo(tab.url);
  }

  if (tab.url && tab.url.includes('youtube.com/playlist')){
    console.log('YouTube Playlist Link Found!');
    downloadYouTubePlaylist(tab.url);
  }
});
