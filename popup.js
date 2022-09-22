// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.url && tab.url.includes('chrome://')){
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

function downloadYouTubeVideo(watch_url){
  console.log(watch_url.split('?'))
}

function downloadYouTubePlaylist(watch_url){
  console.log(watch_url.split('?'))
}