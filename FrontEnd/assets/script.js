// les variables globales

let works = []
let categories = []
const sectionGallery = document.querySelector('.gallery')

// fonction d'initialisation
async function init() {
  works = await getData('works')
  displayData(works)

  categories = await getData('categories')
  displayCategories(categories)

  logIn()
}
init()

/*
   API FONCTION
*/
async function getData(type) {
  const response = await fetch(`http://localhost:5678/api/${type}`)
  if (response.ok) {
    return response.json()
  } else {
    console.log(response)
  }
}

/*
   Categories fonction
*/
function displayCategories(categories) {
  let btnTous = `<button class="filtrage-item activatedBtn" >Tous</button>`
  document.querySelector('#filtrage').innerHTML += btnTous

  for (let index = 0; index < categories.length; index++) {
    const categoryName = categories[index].name

    let btnFiltrage = `
    
        <button class="filtrage-item">${categoryName}</button>
     `
    document.querySelector('#filtrage').innerHTML += btnFiltrage
  }

  const btnFiltrage = document.querySelectorAll('.filtrage-item')

  btnFiltrage.forEach((btn) => {
    btn.addEventListener('click', filterWorks)
  })
}

/*
   Fonction Filtrage des galleries
*/
function filterWorks(btn) {
  const categorieFiltree = btn.target.innerText

  if (categorieFiltree === 'Tous') {
    displayData(works)
  } else {
    const worksFiltres = works.filter(function (item) {
      return item.category.name === categorieFiltree
    })
    displayData(worksFiltres)
  }
  activerBouton(btn)
}

/*
   Fonction Bouton activé une fois cliqué au dessus 
*/
function activerBouton(btn) {
  document.querySelector('.activatedBtn').classList.remove('activatedBtn')
  btn.target.classList.add('activatedBtn')
}

/*
   Fonction afficher les cards
*/
function displayData(works) {
  sectionGallery.innerHTML = ''
  const fragment = document.createDocumentFragment()
  for (let index = 0; index < works.length; index++) {
    const imgCaption = works[index].title
    const imgSrc = works[index].imageUrl

    const cardGallery = document.createElement('figure')

    cardGallery.innerHTML = `
         <img src="${imgSrc}">
         <figcaption>${imgCaption}</figcaption>
   `
    fragment.appendChild(cardGallery)
  }
  sectionGallery.appendChild(fragment)
}

/*
Fonction pour gérer la connexion
*/
function logIn() {
  const formulaireLogIn = document.querySelector('.formulaireLogIn')
  formulaireLogIn.addEventListener('submit', function (event) {
    event.preventDefault()
    const login = {
      email: event.target.querySelector('[name=email]').value,
      password: event.target.querySelector('[name=MDP]').value,
    }
    const chargeUtile = JSON.stringify(login)
    fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: chargeUtile,
    })
  })
}
