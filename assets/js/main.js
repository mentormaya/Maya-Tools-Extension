console.log('Main JS loaded!');

let initial_response_regex = /var ytInitialPlayerResponse = ({.*});/gm

function getYoutubeLinks(html = null){
    html = html ? html : document.body.innerHTML
    console.log('Extracting Links from Youtube...')
    let initialResponse;
    let getInitialResponse = setInterval(()=> {
        console.log('...')
        html =  document.body.innerHTML
        if (html){
            initialContent = initial_response_regex.exec(html)
            if (initialContent){
                initialResponse = JSON.parse(initialContent[1])
                if (initialResponse){
                    clearInterval(getInitialResponse)
                    chrome.runtime.sendMessage({
                        badge: `${initialResponse.streamingData.adaptiveFormats.length}+${initialResponse.streamingData.formats.length}`,
                        details: initialResponse.streamingData
                    })
                }
            }
        }
    }, 2000)
}

function extractLinks(host){
    switch(host) {
        case 'www.youtube.com':
            getYoutubeLinks()
            break;
        default:
            console.log('not video url matched!')
    }
}

function findLinks(){
    chrome.runtime.sendMessage({finding: "..."});
    extractLinks(window.location.host)
}

findLinks();