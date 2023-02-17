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

function parseURL(video) {
  let url = "";
  const cipherParams = new URLSearchParams(video.signatureCipher);
  url = cipherParams.get("url");
  console.log(url);
  return url;
}

function populateLinks(details, streams) {
  let adaptive = streams.adaptiveFormats;
  let progressive = streams.formats;

  let video_title = details.title.split("|")[0];

  let list_html = "";
  let video_url;

  progressive.forEach((video) => {
    video_url = video.url ? video.url : parseURL(video);
    if (video_url) {
      let mime = video.mimeType.split(";")[0].split("/");
      list_html += `<li class="link-item">
        <div class="v-info">
          <span class="video-title">${video_title}</span>
          <span class="media">(${mime[0]})</span>
          <span class="format">${mime[1].toUpperCase()}</span> 
          <span class="quality-label">${video.qualityLabel}</span>
          <div class="download-progress"></div>
        </div>
        <div class="download-btn">
          <a data-name="${video_title}" data-mime="${mime[0]}/${
        mime[1]
      }" href="#" data-link="${video_url}" target="_blank"><i class="fa-solid fa-cloud-arrow-down"></i></a>
        </div>
      </li>`;
    }
  });

  adaptive.forEach((video) => {
    video_url = video.url;
    if (video_url) {
      let mime = video.mimeType.split(";")[0].split("/");
      list_html += `<li class="link-item">
        <div class="v-info">
            <span class="video-title">${video_title}</span>
            <span class="media">(${mime[0]})</span>
            <span class="format">${mime[1].toUpperCase()}</span>
            <span class="quality-label">${
              video.qualityLabel ? video.qualityLabel : video.audioQuality
            }</span>
            <div class="download-progress"></div>
        </div>
        <div class="download-btn">
            <a data-name="${video_title}" data-mime="${mime[0]}/${
              mime[1]
            }" href="#" data-link="${video_url}" target="_blank"><i class="fa-solid fa-cloud-arrow-down"></i></a>
        </div>
      </li>`;
    }
  });
  video_list.innerHTML = list_html;
  const download_btns = document.querySelectorAll(".download-btn a");
  download_btns.forEach((btn) => btn.addEventListener("click", downloadVideo));
}

async function downloadVideo(e) {
  e.preventDefault();
  const link = e.target.parentElement.dataset.link;
  const name = e.target.parentElement.dataset.name;
  const mime = e.target.parentElement.dataset.mime;
  const progressbar =
    e.target.parentNode.parentNode.parentNode.firstChild.nextSibling.lastChild
      .previousElementSibling;

  fetch(link, { method: "get", mode: "no-cors", referrerPolicy: "no-referrer" })
    .then(async (res) => {
      if (res.ok) {
        const reader = res.body.getReader();
        // Step 2: get total length
        const contentLength = +res.headers.get("Content-Length");
        // Step 3: read the data
        let receivedLength = 0; // received that many bytes at the moment
        let chunks = []; // array of received binary chunks (comprises the body)
        progressbar.style.display = "block";
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          chunks.push(value);
          receivedLength += value.length;
          let percentage = (receivedLength / contentLength) * 100;
          progressbar.style.width = `${percentage}%`;
          // console.log(`${percentage}%`)
        }
        return new Blob(chunks, { type: mime });
      } else {
        toast("Something went wrong! Could not get the response!")
      }
    })
    .then((res) => {
      const aElement = document.createElement("a");
      aElement.setAttribute("download", name + '.' + mime.split("/")[1]);
      const href = URL.createObjectURL(res);
      aElement.href = href;
      aElement.setAttribute("target", "_blank");
      aElement.click();
      URL.revokeObjectURL(href);
    });
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
