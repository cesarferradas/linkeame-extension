let state = {}

const baseDomain = 'http://localhost:3000'
// const baseDomain = 'https://linkea.me'

const shortUrl = document.getElementById('url')
const copyCheckbox = document.getElementById('copy')

const copy = () => {
  if (state.autoCopy) {
    const copyText = shortUrl.value
    navigator.clipboard.writeText(copyText)
  }
}

const shorten = (tabs) => {
  const url = tabs[0].url
  const apiUrl = baseDomain + '/api?u=' + encodeURIComponent(url)

  if (!state[url]) {
    fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Csrf-Token': 'token',
      },
    })
      .then((res) => res.json())
      .then((payload) => {
        if (payload.data) {
          const obj = {}
          obj[url] = payload.data
          chrome.storage.local.set(obj)
          shortUrl.value = payload.data
          copy()
        } else {
          shortUrl.value = payload.error || 'Error'
        }
      })
  } else {
    shortUrl.value = state[url]
    copy()
  }
}

copyCheckbox.addEventListener('change', () => {
  state.autoCopy = copyCheckbox.checked
  chrome.storage.local.set({ autoCopy: state.autoCopy })
  copy()
})

chrome.storage.local.get((store) => {
  state = store
  copyCheckbox.checked = state.autoCopy
  chrome.tabs.query({ active: true, currentWindow: true }, shorten)
})
