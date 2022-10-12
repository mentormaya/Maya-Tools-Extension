// const container = document.querySelector('.modal-content')
const content_title = document.querySelector('.content-title')
const expiring = document.querySelector('#expire-in')
const expire_time = document.querySelector('.expire-time')
const list = document.querySelector('.links')

function clearLinks(){
  list.innerHTML = "";
}

function showList(){
  list.style.display = 'flex';
  list.style = 'flex-direction: column;';
  expiring.style.display = 'block';
}

function hideList(){
  list.style.display = 'none';
  expiring.style.display = 'none';
}

function toggleList(){
  if (list.style.display == 'none'){
    showList()
  }else {
    hideList()
  }
}

function populateLinks(details, streams){
  let adaptive = streams.adaptiveFormats
  let progressive = streams.formats

  let video_title = details.title.split("|")[0];

  let list_html = '';

  progressive.forEach((video, index) => {
    let mime = video.mimeType.split(";")[0].split("/")
    let signature_cipher = video.signatureCipher
    console.log(signature_cipher)
    list_html += `<li class="link-item">
    <span class="video-title">Progressive</span>
    <span class="media">(${ mime[0] })</span>
    <span class="format">${ mime[1].toUpperCase() }</span> 
    <span class="quality-label">${video.qualityLabel}</span> 
    <a href="https://ajaysingh.com.np" target="_blank" class="download"><i class="fa-solid fa-cloud-arrow-down"></i></a>
  </li>`;
  });

  // "s=dSXUjnjlkHsUL78hW3Im1-VpUZFnzCC6_7QE_u9ZlwAICwekES1-1Q6hMkkTDZ5fx6LqA0mrVCO0VoLRKv5IKLIYgIARw8JQ0FOgFOg&sp=sig&url=https://rr4---sn-ox25auxaxjvh-3uhl.googlevideo.com/videoplayback%3Fexpire%3D1665593906%26ei%3D0p1GY6VW-ujctQ-N8LTgAg%26ip%3D202.70.79.29%26id%3Do-ALlcfu0oTomRWq4YCncxi-DGNyeoEpJiCzMq-U8uTvm4%26itag%3D137%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%252C399%26source%3Dyoutube%26requiressl%3Dyes%26mh%3DRK%26mm%3D31%252C29%26mn%3Dsn-ox25auxaxjvh-3uhl%252Csn-npoldn76%26ms%3Dau%252Crdu%26mv%3Dm%26mvi%3D4%26pl%3D23%26initcwndbps%3D411250%26vprv%3D1%26mime%3Dvideo%252Fmp4%26ns%3DqOQrhc66RU99g0IXS5yPks8I%26gir%3Dyes%26clen%3D1595450569%26dur%3D8553.252%26lmt%3D1665206556386814%26mt%3D1665572017%26fvip%3D5%26keepalive%3Dyes%26fexp%3D24001373%252C24007246%26c%3DWEB%26txp%3D5535434%26n%3DBfCpTRXg18AZTLFp%26sparams%3Dexpire%252Cei%252Cip%252Cid%252Caitags%252Csource%252Crequiressl%252Cvprv%252Cmime%252Cns%252Cgir%252Cclen%252Cdur%252Clmt%26lsparams%3Dmh%252Cmm%252Cmn%252Cms%252Cmv%252Cmvi%252Cpl%252Cinitcwndbps%26lsig%3DAG3C_xAwRQIgP8ecABcdK3LyhZaNh2I-bTH1bgZsJwtZQzEk5Tl0mV4CIQCfDnoW7aNIqO-k0KcygDe4hAuMi571WsNg1lBG6nvd2Q%253D%253D"

  adaptive.forEach((video, index) => {
    let mime = video.mimeType.split(";")[0].split("/")
    list_html += `<li class="link-item">
    <span class="video-title">Adaptive</span>
    <span class="media">(${ mime[0] })</span>
    <span class="format">${ mime[1].toUpperCase() }</span> 
    <span class="quality-label">${video.qualityLabel ? video.qualityLabel : video.audioQuality}</span>
    <a href="https://ajaysingh.com.np" target="_blank" class="download"><i class="fa-solid fa-cloud-arrow-down"></i></a>
  </li>`;
  });

  list.innerHTML = list_html;
}

function showLinks(details, streams){
  let expiresIn = streams.expiresInSeconds
  
  clearLinks();
  
  content_title.textContent = `Links Found!`;
  expire_time.textContent = expiresIn

  populateLinks(details, streams);
}

// hideList();

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  if (req.details){
    console.log(req.details)
    console.log(req.streams)
    showLinks(req.details, req.streams)  
  }
});
