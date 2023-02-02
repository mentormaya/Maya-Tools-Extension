console.log('fetching quotes please wait...')

const ENG_QUOTE_API = 'https://api.quotable.io/random';

const NEP_QUOTE_API = '';

const HINDI_QUOTE_API = '';

const quote = document.querySelector('#quote');


function fetchQuote(lang = 'en'){
    let api_url = '';
    if (lang == 'hi') api_url = HINDI_QUOTE_API
    else if(lang == 'np') api_url = NEP_QUOTE_API
    else api_url = ENG_QUOTE_API

    fetch(api_url, {
        headers: {
            'Accept': 'application/json'
        }})
    .then(response => response.json())
    .then(quote => {
        let formatted_quote = quote.content + " - " + quote.author;
        
        // quote.innerHTML = formatted_quote;
    })
}


fetchQuote();
