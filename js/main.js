const userCart = []

const getBooks = async () => {
  try {
    const response = await fetch(api)
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}

const removeFromCart = (asin) => {
  const index = userCart.findIndex((book) => book.asin === asin)
  userCart.splice(index, 1)

  const bookCard = document.getElementById(`book-${asin}`)
  if (bookCard) bookCard.classList.remove("opacity-50")

  printCart()
}

const clearCart = () => {
  const cartCopy = [...userCart]

  cartCopy.forEach((book) => {
    removeFromCart(book.asin)
  })
}

const generateCartListItem = ({ title, asin, price }) => {
  const listItem = document.createElement("li")
  listItem.classList.add(
    "list-group-item",
    "d-flex",
    "align-items-center",
    "justify-content-between",
    "gap-2",
  )
  listItem.innerText = `${title} - ${asin} - ${price} EUR`

  const removeButton = document.createElement("button")
  removeButton.classList.add("btn", "btn-sm", "btn-danger")
  removeButton.innerText = "Remove"

  removeButton.addEventListener("click", () => {
    removeFromCart(asin)
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

const addBookToCart = (title, asin, price) => {
  if (!userCart.some((book) => book.asin === asin)) {
    const bookCard = document.getElementById(`book-${asin}`)
    if (bookCard) bookCard.classList.add("opacity-50")

    userCart.push({
      title: title,
      asin: asin,
      price: price,
    })

    printCart()
  }
}

const hideBookCard = (cardId) => {
  const card = document.getElementById(cardId)
  if (card) card.classList.add("d-none")
}

const generateBookCard = ({ title, asin, img, category, price }) => {
  const wrapper = document.createElement("div")
  wrapper.classList.add("col")
  wrapper.id = `book-${asin}`

  if (userCart.some((book) => book.asin === asin)) {
    wrapper.classList.add("opacity-50")
  }

  const card = document.createElement("div")
  card.classList.add("card", "h-100")

  const imageEl = document.createElement("img")
  imageEl.src = img
  imageEl.alt = title
  imageEl.classList.add("img-fluid", "card-img-top")

  const cardBody = document.createElement("div")
  cardBody.classList.add("card-body")

  const titleEl = document.createElement("h5")
  titleEl.classList.add("card-title")
  titleEl.textContent = title

  const asinEl = document.createElement("p")
  asinEl.classList.add("h6", "text-secondary")
  asinEl.textContent = asin

  const categoryEl = document.createElement("p")
  categoryEl.classList.add("badge", "text-bg-light", "border")
  categoryEl.textContent = category

  const cardFooter = document.createElement("div")
  cardFooter.classList.add("card-footer")

  const priceEl = document.createElement("p")
  priceEl.classList.add("h4")
  priceEl.textContent = `${price.toFixed(2)} EUR`

  const buttonAddToCartEl = document.createElement("button")
  buttonAddToCartEl.classList.add("btn", "btn-sm", "btn-primary", "shadow-sm")
  buttonAddToCartEl.textContent = "Add to cart"

  buttonAddToCartEl.addEventListener("click", () => {
    addBookToCart(title, asin, price)
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
    hideBookCard(`book-${asin}`)
  })

  const buttonDetailsEl = document.createElement("a")
  buttonDetailsEl.classList.add(
    "btn",
    "btn-sm",
    "btn-outline-secondary",
    "shadow-sm",
  )
  buttonDetailsEl.textContent = "Details"
  buttonDetailsEl.href = `./details.html?asin=${asin}`

  cardBody.append(titleEl, asinEl, categoryEl)
  cardFooter.append(priceEl, buttonAddToCartEl, buttonSkipEl, buttonDetailsEl)

  card.append(imageEl, cardBody, cardFooter)

  wrapper.appendChild(card)
  return wrapper
}

const printBooks = (container, books) => {
  clearContainer(container)
  showContainer(container)
  books.forEach((book) => {
    container.appendChild(generateBookCard(book))
  })
}

const searchBooks = (search, output) => {
  const spinner = document.getElementById("spinner")
  getBooks()
    .then((books) =>
      books.filter((book) => book.title.toLowerCase().includes(search)),
    )
    .then((books) => {
      hideSpinner(spinner)
      printBooks(output, books)
    })
}

const checkSearchInput = (searchValue, output) => {
  if (searchValue.length > 3 || searchValue.length === 0) {
    searchBooks(searchValue.toLowerCase(), output)
  }
}

window.onload = () => {
  const mainContainer = document.getElementById("main-container")
  const searchInput = document.getElementById("search-input")

  searchBooks("", mainContainer)

  searchInput.addEventListener("input", () => {
    checkSearchInput(searchInput.value, mainContainer)
  })
}
