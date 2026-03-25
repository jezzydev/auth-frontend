import * as api from './api.js';
import * as auth from './auth.js';

const registerForm = document.querySelector('#registerForm');
const registerValidationMsg = document.querySelector(
    '#registerForm .validation-msg',
);

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    //TODO: do form validation

    const formData = new FormData(e.target);
    await registerUser(formData);
});

registerForm.querySelectorAll('input').forEach((elem) => {
    elem.addEventListener('input', (e) => {
        e.target.textContent = '';
        e.target.setAttribute('aria-invalid', false);
        registerValidationMsg.classList.remove('visible');
    });
});

async function registerUser(formData) {
    const data = Object.fromEntries(formData.entries());

    try {
        const success = await api.register(data);
        if (success) {
            window.location.replace(
                `../login.html?success=${encodeURIComponent(success)}`,
            );
            return;
        }
        throw new Error(
            'Registration failed. Fix your inputs or try again later',
        );
    } catch (error) {
        registerValidationMsg.textContent = error.message;
        //TODO: display field-level error
    }
}
