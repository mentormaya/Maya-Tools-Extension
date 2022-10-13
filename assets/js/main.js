console.log('Main JS loaded!');

let initial_response_regex = /var ytInitialPlayerResponse = ({.*});/gm

let yt_player, yt_right_controls;

function downloadVideo(){
    alert('downloading...');
}

function putDownloadBtn(){
    const downloadBtnExists = document.querySelector('.ytp-video-download-button');
    if (!downloadBtnExists){
        const downloadBtn = document.createElement('img');
        downloadBtn.src = "data:image/png;base64,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";
        downloadBtn.className = "ytp-button " + "ytp-video-download-button";
        downloadBtn.style = "height: 2.3rem; width: 2.3rem; padding: 0.8rem; margin-bottom: 0.4rem;"

        downloadBtn.addEventListener("click", downloadVideo);

        yt_right_controls.appendChild(downloadBtn);
    }
}

function getYoutubeLinks(html = null){
    html = html ? html : document.body.innerHTML
    console.log('Extracting Links from Youtube...')
    let initialResponse;
    let getInitialResponse = setInterval(()=> {
        console.log('...')
        html =  document.body.innerHTML
        yt_player = document.querySelector('.video-stream')
        yt_right_controls = document.querySelector('.ytp-right-controls')
        if (yt_right_controls) putDownloadBtn()
        if (html){
            initialContent = initial_response_regex.exec(html)
            if (initialContent){
                initialResponse = JSON.parse(initialContent[1])
                if (initialResponse){
                    clearInterval(getInitialResponse)
                    chrome.runtime.sendMessage({
                        badge: `${initialResponse.streamingData.adaptiveFormats.length}+${initialResponse.streamingData.formats.length}`,
                        details: initialResponse.videoDetails,
                        streams: initialResponse.streamingData
                    })
                }
            }
        }
    }, 2000)
}

function extractLinks(location){
    switch(location.host) {
        case 'www.youtube.com':
            if (location.href.includes('youtube.com/watch')){
                getYoutubeLinks()
            }
            break;
        default:
            console.log('not video url matched!')
    }
}

function findLinks(){
    chrome.runtime.sendMessage({finding: "..."});
    extractLinks(window.location)
}

findLinks();