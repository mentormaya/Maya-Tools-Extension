const content_title = document.querySelector(".content-title");
const expiring = document.querySelector("#expire-in");
const expire_time = document.querySelector(".expire-time");
const video_list = document.querySelector(".v-links");

let currentVideoData,
  videoID = null;

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function clearLinks() {
  if (video_list != null) {
    video_list.innerHTML = "";
    expiring.style.display = "none";
  }
}

function showList() {
  video_list.style.display = "flex";
  video_list.style = "flex-direction: column;";
  expiring.style.display = "block";
}

function hideList() {
  video_list.style.display = "none";
  expiring.style.display = "none";
}

function toggleList() {
  if (video_list.style.display == "none") {
    showList();
  } else {
    hideList();
  }
}

function populateLinks(details, streams) {
  let adaptive = streams.adaptiveFormats;
  let progressive = streams.formats;

  let video_title = details.title.split("|")[0];

  let list_html = "";
  let video_url;

  progressive.forEach((video, index) => {
    let mime = video.mimeType.split(";")[0].split("/");
    video_url = video.url;
    if (!video_url) return;
    list_html += `<li class="link-item">
      <div class="v-info">
        <span class="video-title">${video_title}</span>
        <span class="media">(${mime[0]})</span>
        <span class="format">${mime[1].toUpperCase()}</span> 
        <span class="quality-label">${video.qualityLabel}</span>
      </div>
      <div class="download-btn">
        <a class="download" download="${video_title}" href="${video_url}"><i class="fa-solid fa-cloud-arrow-down"></i></a>
      </div>
    </li>`;
  });

  adaptive.forEach((video, index) => {
    video_url = video.url;
    if (!video_url) return;
    let mime = video.mimeType.split(";")[0].split("/");
    list_html += `<li class="link-item">
    <div class="v-info">
        <span class="video-title">${video_title}</span>
        <span class="media">(${mime[0]})</span>
        <span class="format">${mime[1].toUpperCase()}</span>
        <span class="quality-label">${
          video.qualityLabel ? video.qualityLabel : video.audioQuality
        }</span>
    </div>
    <div class="download-btn">
        <a class="download" download="${video_title}" href="${video_url}"><i class="fa-solid fa-cloud-arrow-down"></i></a>
    </div>
  </li>`;
  });

  video_list.innerHTML = list_html;
}

function showLinks(details, streams) {
  let expiresIn = streams.expiresInSeconds;
  content_title.textContent = `Links Found!`;
  showList();
  expire_time.textContent = expiresIn;
  populateLinks(details, streams);
}

document.addEventListener("DOMContentLoaded", async () => {
  clearLinks();
  const activeTab = await getCurrentTab();

  //   check if the tab is YouTube or not?
  if (activeTab.url.includes("youtube.com/watch")) {
    //if yes get the video ID from the url parameters
    const queryParams = activeTab.url.split("?")[1];
    const urlParams = new URLSearchParams(queryParams);
    const videoId = urlParams.get("v");

    chrome.storage.local.get(["currentVideoData"]).then((result) => {
      currentVideoData = result.currentVideoData;
      if (videoId === currentVideoData.details.videoId) {
        showLinks(currentVideoData.details, currentVideoData.streams);
        toast("Links found to be downloadable!");
      } else toast("Links are stale! Please reload the Page!");
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "show_links") {
    currentVideoData = request.currentVideoData;
    videoID = request.currentVideoData.details.videoId;
    showLinks(currentVideoData.details, currentVideoData.streams);
  }
});
