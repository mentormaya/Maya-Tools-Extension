console.log('Main JS loaded!');

let initial_response_regex = /var ytInitialPlayerResponse = ({.*});/gm

function getYoutubeLinks(html = null){
    html = html ? html : document.body.innerHTML
    console.log('Extracting Links from Youtube...')
    let initialResponse;
    let getInitialResponse = setInterval(()=> {
        html =  document.body.innerHTML
        if (html){
            initialContent = initial_response_regex.exec(html)
            if (initialContent){
                initialResponse = JSON.parse(initialContent[1])
                if (initialResponse){
                    clearInterval(getInitialResponse)
                    chrome.runtime.sendMessage({
                        status: 'Links found!',
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
    chrome.runtime.sendMessage({status: "..."});
    console.log('finding links...')
    extractLinks(window.location.host)
}

findLinks();