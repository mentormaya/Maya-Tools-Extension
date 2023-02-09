const container = document.querySelector('.modal-content')
const content_title = document.querySelector('.content-title')
const expiring = document.querySelector('#expire-in')
const expire_time = document.querySelector('.expire-time')
const video_list = document.querySelector('.v-links')
const list = document.querySelector('.links')

const API = "https://sapi.deta.dev";

let currentVideoData;

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function clearLinks(){
  // console.log(video_list)
  if(video_list != null){
    video_list.innerHTML = "";
    expiring.style.display = "none";
  }
}

function showList(){
  video_list.style.display = 'flex';
  video_list.style = 'flex-direction: column;';
  expiring.style.display = 'block';
}

function hideList(){
  video_list.style.display = 'none';
  expiring.style.display = 'none';
}

function toggleList(){
  if (video_list.style.display == 'none'){
    showList()
  }else {
    hideList()
  }
}

function populateLinks(details, streams){
  // let adaptive = streams.adaptiveFormats
  let progressive = streams.formats

  let video_title = details.title.split("|")[0];

  let list_html = '';
  let video_url;

  progressive.forEach((video, index) => {
    let mime = video.mimeType.split(";")[0].split("/")
    video_url = video.url;
    if (!video_url) return;
    list_html += `<li class="link-item">
    <span class="video-title">Progressive</span>
    <span class="media">(${ mime[0] })</span>
    <span class="format">${ mime[1].toUpperCase() }</span> 
    <span class="quality-label">${video.qualityLabel}</span>
    <a class="download" download="${video_title}" href="${video_url}"><i class="fa-solid fa-cloud-arrow-down"></i></a>
  </li>`;
  });

  // adaptive.forEach((video, index) => {
  //   video_url = video.url;
  //   if (!video_url) return;
  //   let mime = video.mimeType.split(";")[0].split("/")
  //   list_html += `<li class="link-item">
  //   <span class="video-title">Adaptive</span>
  //   <span class="media">(${ mime[0] })</span>
  //   <span class="format">${ mime[1].toUpperCase() }</span> 
  //   <span class="quality-label">${video.qualityLabel ? video.qualityLabel : video.audioQuality}</span>
  //   <a class="download" download="${video_title}" href="${video_url}"><i class="fa-solid fa-cloud-arrow-down"></i></a>
  // </li>`;
  // });

  video_list.innerHTML = list_html;
}

function showLinks(details, streams){
  let expiresIn = streams.expiresInSeconds;  
  content_title.textContent = `Links Found!`;
  expire_time.textContent = expiresIn

  populateLinks(details, streams);
}

function getToday(){
  let result = document.querySelector("#home_today");

  let api_url = `${API}/today`;
  result.innerHTML = "fetching today's date...";
  fetch(api_url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        result.innerHTML = "Something went wrong!";
      } else {
        result.innerHTML = `${data.full_nep_date_nep}(${data.full_int_date})`;
      }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  clearLinks();
  getToday();
  const activeTab = await getCurrentTab();

  if (activeTab.url.includes("youtube.com/watch")){
    const queryParams = activeTab.url.split("?")[1];
    const urlParams = new URLSearchParams(queryParams);
    const videoID = urlParams.get("v");

    chrome.storage.sync.get(["videoID"], function(data) {
      if (!data){
        console.log('data not found!');
        return
      } else {
        console.log(data);
      }
    });
  }
});