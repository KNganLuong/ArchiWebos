/*
Fonction pour gérer la connexion
*/
const formulaireLogIn = document.querySelector('.formulaireLogIn')
formulaireLogIn.addEventListener('submit', function (event) {
  event.preventDefault()
  const loginData = {
    email: event.target.querySelector('[name=email]').value,
    password: event.target.querySelector('[name=password]').value,
  }
  // console.log(loginData)
  const data = JSON.stringify(loginData)
  logIn(data)
})

if (isConnected()) {
  window.location.href = 'index.html'
}

async function logIn(data) {
  const response = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: data,
  })
  if (response.ok) {
    const responseJson = await response.json()
    const valeurToken = responseJson.token
    window.localStorage.setItem('tokenAcces', valeurToken)
    window.location.href = 'index.html'
  } else {
    let afficherErreur = document.getElementById('alertError')
    afficherErreur.textContent = 'Email/Mot de passe est incorrect'
  }
}
