import { auth, db } from './firebase.js';

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/11.8.0/firebase-auth.js';

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/11.8.0/firebase-firestore.js';

function showLoginError(message) {
    const errDiv = document.getElementById('login-error');
    if (message) {
    errDiv.textContent = message;
    errDiv.style.display = 'block';
    } else {
    errDiv.textContent = '';
    errDiv.style.display = 'none';
    }
}

onAuthStateChanged(auth, user => {
    if (user) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('todo-section').style.display = 'block';
    showLoginError('');
    loadTodos(user);
    } else {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('todo-section').style.display = 'none';
    showLoginError('');
    }
});

window.login = async function () {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        await signInWithEmailAndPassword(auth, email, password);
        showLoginError('');
    } catch (error) {
        console.error('Error logging in:', error);
        showLoginError(error.message || 'Login failed.');
    }
};

window.register = async function () {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        await createUserWithEmailAndPassword(auth, email, password);
        showLoginError('');
    } catch (error) {
        console.error('Error registering:', error);
        showLoginError(error.message || 'Registration failed.');
    }
};

window.logout = async function () {
    await signOut(auth);
    document.getElementById('todo-list').innerHTML = '';
};

async function loadTodos(user) {
    const q = query(collection(db, 'todos'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const item = document.createElement('li');
    item.id = `todo-${docSnap.id}`;

    item.innerHTML = `
        <span class="todo-title">${data.title}</span>
        <button onclick="editTodo('${docSnap.id}', '${data.title.replace(/'/g, "\\'")}')">Edit</button>
        <button onclick="deleteTodo('${docSnap.id}')">Delete</button>
    `;

    list.appendChild(item);
    });
}

window.addTodo = async function () {
    const task = document.getElementById('new-task').value;
    if (!task || !auth.currentUser) return;

    await addDoc(collection(db, 'todos'), {
    title: task,
    completed: false,
    userId: auth.currentUser.uid,
    createdAt: Date.now()
    });

    document.getElementById('new-task').value = '';
    loadTodos(auth.currentUser);
};

window.editTodo = function (id, oldTitle) {
    const item = document.getElementById(`todo-${id}`);
    if (!item) return;

    // Replace content with input and submit button
    item.innerHTML = `
    <input type="text" id="edit-input-${id}" value="${oldTitle}" />
    <button onclick="submitEditTodo('${id}', '${oldTitle.replace(/'/g, "\\'")}')">Save</button>
    <button onclick="cancelEditTodo('${id}', '${oldTitle.replace(/'/g, "\\'")}')">Cancel</button>
    `;
};

window.submitEditTodo = async function (id, oldTitle) {
    const input = document.getElementById(`edit-input-${id}`);
    const newTitle = input.value;
    if (!newTitle || newTitle.trim() === oldTitle.trim()) {
    window.cancelEditTodo(id, oldTitle);
    return;
    }

    await updateDoc(doc(db, 'todos', id), { title: newTitle });
    loadTodos(auth.currentUser);
};

window.cancelEditTodo = function (id, oldTitle) {
    // Restore the original display for this todo
    const item = document.getElementById(`todo-${id}`);
    if (!item) return;
    item.innerHTML = `
    <span class="todo-title">${oldTitle}</span>
    <button onclick="editTodo('${id}', '${oldTitle.replace(/'/g, "\\'")}')">Edit</button>
    <button onclick="deleteTodo('${id}')">Delete</button>
    `;
};

window.deleteTodo = async function (id) {
    await deleteDoc(doc(db, 'todos', id));
    loadTodos(auth.currentUser);
};