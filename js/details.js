const params = new URLSearchParams(window.location.search)
const paramAsin = params.get("asin")

const getBook = async () => {
  try {
    const rawBook = await fetch(`${api}/${paramAsin}`)
    return rawBook.json()
  } catch (error) {
    console.error(error)
  }
}

const showBook = ({ asin, img, title, category, price }) => {
  const imgEl = document.getElementById("book-img")
  imgEl.src = img
  imgEl.alt = title

  const titleEl = document.getElementById("book-title")
  titleEl.innerText = title

  const asinEl = document.getElementById("book-asin")
  asinEl.innerText = asin

  const categoryEl = document.getElementById("book-category")
  categoryEl.innerText = category

  const priceEl = document.getElementById("book-price")
  priceEl.innerText = `${price.toFixed(2)} EUR`

  const container = document.getElementById("main")
  showContainer(container)
}

window.onload = () => {
  const spinner = document.getElementById("spinner")
  const errorContainer = document.getElementById("error")
  getBook()
    .then((book) => {
      showBook(book)
      hideSpinner(spinner)
    })
    .catch((error) => {
      showError(error, errorContainer)
      hideSpinner(spinner)
    })
}
