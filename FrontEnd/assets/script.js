// les variables globales

let works = []
let categories = []
const sectionGallery = document.querySelector('.gallery')
const tokenAcces = window.localStorage.getItem('tokenAcces')

document
  .getElementById('inputPhoto')
  .addEventListener('change', changeBackground)

document
  .getElementById('formAddPhoto')
  .addEventListener('submit', function (event) {
    uploadPhoto(event, sectionMediasModal)
  })

// fonction d'initialisation
async function init() {
  works = await getData('works')

  displayData(works)

  createMediasModal(works)

  categories = await getData('categories')
  buildCategorieMenu(categories)

  if (isConnected()) {
    setAdminMode()
  } else {
    displayCategories(categories)
  }
}

init()

/*
   fonction changer page une fois que la connexion est réussie
*/
function setAdminMode() {
  setTitleLogin()
  addBtnModify()
  addBlackBanner()
}

/*
   Fonction ajouter bouton modifier
*/
function addBtnModify() {
  const btnModify = document.getElementById('containerModify')
  btnModify.textContent = 'modifier'

  const linkIcon = document.getElementById('linkIcon')
  const iconModify = document.createElement('i')
  iconModify.classList.add('fa-regular', 'fa-pen-to-square')
  linkIcon.appendChild(iconModify)
}

/*
   fonction remplacer le titre de login
*/
function setTitleLogin() {
  const titreLogIn = document.querySelector('#loginLogoutLink')
  titreLogIn.id = 'logOutTitle'
  titreLogIn.innerHTML = ''
  titreLogIn.textContent = 'logout'
  logOut()
}

/*
  ajouter banner
*/
function addBlackBanner() {
  const blackBanner = document.getElementById('blackBanner')
  blackBanner.innerHTML = `
  <i class= "fa-regular fa-pen-to-square"></i>
  <span>Mode édition</span>
  `
  blackBanner.style.display = null
}

/*
   API FONCTION
*/
async function getData(type) {
  const response = await fetch(`http://localhost:5678/api/${type}`)
  if (response.ok) {
    return response.json()
  } else {
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

  const categoriesBtn = document.querySelectorAll('.filtrage-item')

  categoriesBtn.forEach((categorieBtn) => {
    categorieBtn.addEventListener('click', filterWorks)
  })
}

/*
   Fonction Filtrage des galleries
*/
function filterWorks(categorieBtn) {
  const categorieFiltree = categorieBtn.target.innerText

  if (categorieFiltree === 'Tous') {
    displayData(works)
  } else {
    const worksFiltres = works.filter(function (item) {
      return item.category.name === categorieFiltree
    })
    displayData(worksFiltres)
  }
  setActiveCategorieSelected(categorieBtn)
}

/*
   Fonction Bouton activé une fois cliqué au dessus 
*/
function setActiveCategorieSelected(categorieBtn) {
  document.querySelector('.activatedBtn').classList.remove('activatedBtn')
  categorieBtn.target.classList.add('activatedBtn')
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
    cardGallery.id = 'photo-gallery-' + works[index].id

    cardGallery.innerHTML = `
         <img src="${imgSrc}">
         <figcaption>${imgCaption}</figcaption>
   `
    fragment.appendChild(cardGallery)
  }
  sectionGallery.appendChild(fragment)
}

/*
   Fonction clic sur logOut
*/
function logOut() {
  const lienLogOut = document.querySelector('#logOutTitle')
  lienLogOut.addEventListener('click', function (event) {
    event.preventDefault()
    window.localStorage.removeItem('tokenAcces')
    window.location.href = 'index.html'
    titreLogIn.innerHTML = ''
    titreLogIn.textContent = 'login'
  })
}

/*
  Ouvrir, fermer et retourner modale
*/
const modalGallery = document.getElementById('modalGallery')

document.querySelectorAll('.js-modal').forEach((a) => {
  a.addEventListener('click', openModal)
})
document.querySelectorAll('.js-modal-stop').forEach((i) => {
  i.addEventListener('click', stopPropagation)
})

modalContainer.addEventListener('click', closeModal)

document.querySelectorAll('.iconCloseModal').forEach((i) => {
  i.addEventListener('click', closeModal)
})

function openModal(event) {
  event.preventDefault()
  modalGallery.style.display = null
}

function stopPropagation(event) {
  event.stopPropagation()
}

function closeModal(event) {
  event.preventDefault()
  modalGallery.style.display = 'none'
  modalAddPhoto.style.display = 'none'
}

document.querySelector('.iconReturn').addEventListener('click', function () {
  modalAddPhoto.style.display = 'none'
  modalGallery.style.display = null

  cleanModalAddPhoto()
  removeBackground()
})

function cleanModalAddPhoto() {
  const alertSuccess = document.getElementById('alertSuccess')
  if (alertSuccess) {
    alertSuccess.remove()
  }
  document.querySelector('input[name="title"]').value = ''
}

/*
  Ajouter les médias dans la galerie
*/
const sectionMediasModal = document.getElementById('mediasModal')

function createMediasModal(works) {
  sectionMediasModal.innerHTML = ''
  for (let index = 0; index < works.length; index++) {
    const mediaContainer = document.createElement('div')
    mediaContainer.id = 'photo-bin-modal-' + works[index].id

    const imgSrc = works[index].imageUrl

    mediaContainer.innerHTML += `<img src="${imgSrc}">
  <i class="iconBin fa-solid fa-trash-can"></i>  `

    sectionMediasModal.appendChild(mediaContainer)

    const trash = mediaContainer.querySelector('i')
    trash.addEventListener('click', function () {
      delMedias(works[index].id, mediaContainer)
    })
  }
}

/*
  Supprimer les travaux dans modale
*/
async function delMedias(id, mediaContainer) {
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${tokenAcces}`,
    },
  })
  if (response.ok) {
    mediaContainer.remove()
    works = await getData('works')
    displayData(works)
  } else {
    alert('La photo ne peut pas être supprimée')
  }
}

/*
  formulaire dans modale pour ajouter les photos
*/
modalAddPhoto = document.getElementById('modal-add-photo')
modalAddPhoto.addEventListener('click', closeModal)

document.getElementById('btnAddPhoto').addEventListener('click', function () {
  modalGallery.style.display = 'none'
  modalAddPhoto.style.display = null
})

/*
  récupérer catégorie pour sélectionner
*/
function buildCategorieMenu(categories) {
  const categorieSelect = document.getElementById('categorie')

  for (let index = 0; index < categories.length; index++) {
    const categoryName = categories[index].name
    const categoryId = categories[index].id

    let categorieOption = `
    <option value = "${categoryId}" >${categoryName}</option>
    `
    categorieSelect.innerHTML += categorieOption
  }
}

/*
  ajouter les photos 
*/

const addPhotoContainer = document.getElementById('addPhotoContainer')
const previewPhoto = document.createElement('img')

/*
  change photo d'arrière lors de sélection d'une photo
*/

function changeBackground() {
  const file = inputPhoto.files[0]
  const reader = new FileReader()

  reader.onload = function (e) {
    previewPhoto.id = 'previewPhoto'
    previewPhoto.src = e.target.result

    const trashIcon = document.createElement('i')
    trashIcon.id = 'trashIcon'
    trashIcon.classList.add('iconBin', 'fa-solid', 'fa-trash-can')

    addPhotoContainer.parentNode.appendChild(trashIcon)
    addPhotoContainer.parentNode.appendChild(previewPhoto)
    addPhotoContainer.style.display = 'none'
    previewPhoto.style.display = null

    trashIcon.addEventListener('click', removeBackground)
    document.querySelectorAll('.iconCloseModal').forEach((i) => {
      i.addEventListener('click', removeBackground)
    })
  }
  if (file) {
    reader.readAsDataURL(file)
  }
}

/*
  retour en avant en cas d'esc
*/

function removeBackground() {
  if (previewPhoto && previewPhoto.parentNode) {
    addPhotoContainer.style.display = null
    previewPhoto.style.display = 'none'
  }

  inputPhoto.value = ''

  const trashIcon = document.getElementById('trashIcon')
  if (trashIcon) {
    trashIcon.remove()
  }
}

/*
  ajout des photos
*/
async function uploadPhoto(event) {
  event.preventDefault()

  const formData = new FormData(formAddPhoto)
  const response = await fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${tokenAcces}`,
    },
    body: formData,
  })

  if (response.ok) {
    const photoUploaded = await response.json()
    addPhotoUploaded(photoUploaded)

    works = await getData('works')
    displayData(works)

    alertAddImageSucces()

    removeBackground()
  } else {
    const alertContent = document.createElement('span')
    alertContent.textContent = 'Veuillez remplir le formulaire'
    formAddPhoto.appendChild(alertContent)
    document.getElementById('btnValid').classList.add('buttonNoValid')
  }
}

/*
  message Succès
*/

function alertAddImageSucces() {
  const alertContent = document.createElement('span')
  alertContent.id = 'alertSuccess'
  alertContent.textContent = 'Photo ajoutée'

  formAddPhoto.appendChild(alertContent)
}

/*
  fonctions ajouter photo envoyée
*/

function addPhotoUploaded(photoUploaded) {
  const mediaContainer = document.createElement('div')
  mediaContainer.id = 'photo-bin-modal-' + photoUploaded.id

  const imgSrc = photoUploaded.imageUrl

  mediaContainer.innerHTML += `<img src="${imgSrc}">
  <i class="iconBin fa-solid fa-trash-can"></i>  `

  sectionMediasModal.appendChild(mediaContainer)

  const trash = mediaContainer.querySelector('i')
  trash.addEventListener('click', function () {
    delMedias(photoUploaded.id, mediaContainer)
  })
}
