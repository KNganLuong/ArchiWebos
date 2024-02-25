/*
   fonction check token
*/

function isConnected() {
  const valeurToken = window.localStorage.getItem('tokenAcces')
  if (valeurToken !== null) {
    return true
  }

  return false
}
