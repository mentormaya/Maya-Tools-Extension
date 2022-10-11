function showLinks(details){
  let expiresIn = details.expiresInSeconds
  let adaptive = details.adaptiveFormats
  let progressive = details.formats

  let total = adaptive.length + progressive.length

  const container = document.querySelector('.modal-content')

  container.innerHTML = "<h1> Something Happened!</h1>"
}