const { auth } = require('./firebase');
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');

window.login = async function () {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    alert('Logged in as: ' + userCred.user.email);
  } catch (err) {
    alert('Login failed: ' + err.message);
  }
};

window.register = async function () {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    alert('Registered as: ' + userCred.user.email);
  } catch (err) {
    alert('Register failed: ' + err.message);
  }
};
