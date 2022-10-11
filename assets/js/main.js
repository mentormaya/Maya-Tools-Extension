console.log('Main JS loaded!');

function findLinks(){
    chrome.runtime.sendMessage({status: "..."});
    let initialResponse;
    let getInitialResponse = setInterval(()=> {
        console.log('finding links...')
        console.log(window)
        initialResponse = window.ytInitialPlayerResponse
        console.log(`inital Response: ${initialResponse}`)
        if (typeof window !== 'undefined' && typeof initialResponse !== 'undefined'){
            clearInterval(getInitialResponse)
            console.log(initialResponse)
        }
    }, 2000)
}

findLinks();