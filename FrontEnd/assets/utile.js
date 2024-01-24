/*
   fonction check token
*/

function checkConnexion() {
  const valeurToken = window.localStorage.getItem('tokenAcces')
  if (valeurToken !== null) {
    return true
  }

  return false
}
