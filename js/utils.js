const api = "https://striveschool-api.herokuapp.com/books"

const hideSpinner = (spinner) => {
  spinner.classList.add("d-none")
}

const clearContainer = (container) => {
  container.innerHTML = ""
}

const showContainer = (container) => {
  container.classList.remove("d-none")
}

const showError = (error, el) => {
  el.innerText = error
}
