import * as api from './api.js';

const loginForm = document.querySelector('#loginForm');
const loginValidationMsg = document.querySelector('#loginForm .validation-msg');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    //TODO: do form validation

    const formData = new FormData(e.target);
    await loginUser(formData);
});

loginForm.querySelectorAll('input').forEach((elem) => {
    elem.addEventListener('input', (e) => {
        loginValidationMsg.classList.remove('visible');
        e.target.setAttribute('aria-invalid', false);
    });
});

async function loginUser(formData) {
    const data = Object.fromEntries(formData.entries());
    try {
        await api.login(data);
        window.location.replace('../dashboard.html');
        return;
    } catch (error) {
        loginValidationMsg.textContent = error.message;
        loginValidationMsg.classList.add('visible');
    }
}
