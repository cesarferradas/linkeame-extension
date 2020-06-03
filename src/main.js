const shortUrlElement = document.getElementById('shortUrl')
const baseDomain = 'https://linkea.me'

const shortenUrl = (tabs) => {
  const url = tabs[0].url
  const apiUrl = baseDomain + '/api?u=' + encodeURIComponent(url)

  chrome.storage.local.get(res => {
    if (!res[url]) {
      fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Csrf-Token': 'token', // TODO add UUID
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.data) {
            const obj = {}
            obj[url] = data.data
            chrome.storage.local.set(obj)
            shortUrlElement.value = data.data
          } else if (data.error) {
            shortUrlElement.value = data.error
          } else {
            shortUrlElement.value = 'hubo un error :('
          }
        })
    } else {
      shortUrlElement.value = res[url]
    }
  })
}

chrome.tabs.query({ active: true, currentWindow: true }, shortenUrl)
