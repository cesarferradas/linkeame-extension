const shortUrlElement = document.getElementById('shortUrl')
// const baseDomain = 'https://linkea.me'
const baseDomain = 'http://localhost:3000'

function shortenUrl(tabs) {
  const url = tabs[0].url // safe to assume only one result
  const apiUrl = baseDomain + '/api?u=' + encodeURIComponent(url)

  browser.storage.local.get()
    .then((res) => {
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
              browser.storage.local.set(obj)
              shortUrlElement.value = data.data
            } else {
              shortUrlElement.value = 'hubo un error :('
            }
          })
      } else {
        shortUrlElement.value = res[url]
      }
    })
}

browser.tabs.query({ currentWindow: true, active: true }).then(shortenUrl)
