const booksApi = "https://striveschool-api.herokuapp.com/books"

const userCart = []

const getBooks = async () => {
  try {
    const response = await fetch(booksApi)
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}

const booksAttributeMap = async (books) => {
  return books.map(({ title, asin, img, category, price }) => {
    return {
      title: title,
      code: asin,
      img: img,
      category: category,
      price: price,
    }
  })
}

const removeFromCart = (code) => {
  const index = userCart.findIndex((book) => book.code === code)
  userCart.splice(index, 1)

  const bookCard = document.getElementById(`book-${code}`)
  if (bookCard) bookCard.classList.remove("opacity-50")

  printCart()
}

const clearCart = () => {
  const cartCopy = [...userCart]

  cartCopy.forEach((book) => {
    removeFromCart(book.code)
  })
}

const generateCartListItem = ({ title, code, price }) => {
  const listItem = document.createElement("li")
  listItem.classList.add(
    "list-group-item",
    "d-flex",
    "align-items-center",
    "justify-content-between",
    "gap-2",
  )
  listItem.innerText = `${title} - ${code} - ${price} EUR`

  const removeButton = document.createElement("button")
  removeButton.classList.add("btn", "btn-sm", "btn-danger")
  removeButton.innerText = "Remove"

  removeButton.addEventListener("click", () => {
    removeFromCart(code)
  })

  listItem.append(removeButton)

  return listItem
}

const printCart = () => {
  const itemsCount = document.getElementById("cart-total-items")
  const priceCount = document.getElementById("cart-total-price")
  const container = document.getElementById("cart-list-container")
  container.innerHTML = ""

  itemsCount.innerText = userCart.length
  priceCount.innerText = userCart
    .reduce((acc, curr) => acc + curr.price, 0)
    .toFixed(2)

  userCart.forEach((book) => container.appendChild(generateCartListItem(book)))
}

const addBookToCart = (title, code, price) => {
  const hasBook = userCart.some((book) => book.code === code)

  if (!hasBook) {
    const bookCard = document.getElementById(`book-${code}`)
    if (bookCard) bookCard.classList.add("opacity-50")

    userCart.push({
      title: title,
      code: code,
      price: price,
    })

    printCart()
  }
}

const hideBookCard = (cardId) => {
  const card = document.getElementById(cardId)
  if (card) card.classList.add("d-none")
}

const generateBookCard = ({ title, code, img, category, price }) => {
  const inCart = userCart.some((book) => book.code === code)

  const wrapper = document.createElement("div")
  wrapper.classList.add("col")
  wrapper.id = `book-${code}`

  const card = document.createElement("div")
  card.classList.add("card", "h-100")

  if (inCart) {
    card.classList.add("opacity-50")
  }

  const imageEl = document.createElement("img")
  imageEl.src = img
  imageEl.alt = title
  imageEl.classList.add("img-fluid", "card-img-top")

  const cardBody = document.createElement("div")
  cardBody.classList.add("card-body")

  const titleEl = document.createElement("h5")
  titleEl.classList.add("card-title")
  titleEl.textContent = title

  const codeEl = document.createElement("p")
  codeEl.classList.add("h6", "text-secondary")
  codeEl.textContent = code

  const categoryEl = document.createElement("p")
  categoryEl.classList.add("badge", "text-bg-light", "border")
  categoryEl.textContent = category

  const cardFooter = document.createElement("div")
  cardFooter.classList.add("card-footer")

  const priceEl = document.createElement("p")
  priceEl.classList.add("h4")
  priceEl.textContent = `${price} EUR`

  const buttonAddToCartEl = document.createElement("button")
  buttonAddToCartEl.classList.add("btn", "btn-sm", "btn-primary", "shadow-sm")
  buttonAddToCartEl.textContent = "Add to cart"

  buttonAddToCartEl.addEventListener("click", () => {
    addBookToCart(title, code, price)
  })

  const buttonSkipEl = document.createElement("button")
  buttonSkipEl.classList.add(
    "btn",
    "btn-sm",
    "btn-outline-secondary",
    "shadow-sm",
    "mx-2",
  )
  buttonSkipEl.textContent = "Skip"

  buttonSkipEl.addEventListener("click", () => {
    hideBookCard(`book-${code}`)
  })

  cardBody.append(titleEl, codeEl, categoryEl)
  cardFooter.append(priceEl, buttonAddToCartEl, buttonSkipEl)

  card.append(imageEl, cardBody, cardFooter)

  wrapper.appendChild(card)
  return wrapper
}

const clearContainer = (container) => {
  container.innerHTML = ""
}

const printBooks = (container, books) => {
  clearContainer(container)
  books.forEach((book) => {
    container.appendChild(generateBookCard(book))
  })
}

const searchBooks = async (search, mainContainer) => {
  getBooks()
    .then((books) => booksAttributeMap(books))
    .then((books) =>
      books.filter((book) => book.title.toLowerCase().includes(search)),
    )
    .then((books) => printBooks(mainContainer, books))
}

window.onload = () => {
  const mainContainer = document.getElementById("main-container")
  const searchInput = document.getElementById("search-input")

  searchBooks("", mainContainer)

  searchInput.addEventListener("input", () => {
    inputLength = searchInput.value.length
    if (inputLength > 3 || inputLength === 0) {
      searchBooks(searchInput.value.toLowerCase(), mainContainer)
    }
  })
}
