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
        clearInputError(e.target);
    });
});

registerForm.querySelector('select').addEventListener('change', (e) => {
    clearInputError(e.target);
});

function clearInputError(elem) {
    elem.setAttribute('aria-invalid', false);
    const errorMsg = elem.parentNode.querySelector('span.error-message');
    errorMsg.textContent = '';
    errorMsg.classList.remove('visible');
    registerValidationMsg.textContent = '';
    registerValidationMsg.classList.remove('visible');
}

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
        if (error.cause?.message) {
            const errorMsg = error.cause.message;
            const errorMsgLowerCase = errorMsg.toLowerCase();
            let input;
            let inputValidationMsg;

            if (errorMsgLowerCase.includes('password')) {
                input = document.getElementById('password');
                inputValidationMsg = document.getElementById('password-error');
            } else if (errorMsgLowerCase.includes('email')) {
                input = document.getElementById('email');
                inputValidationMsg = document.getElementById('email-error');
            } else if (errorMsgLowerCase.includes('date')) {
                input = document.getElementById('bdate');
                inputValidationMsg = document.getElementById('bdate-error');
            } else if (errorMsgLowerCase.includes('role')) {
                input = document.getElementById('role');
                inputValidationMsg = document.getElementById('role-error');
            }

            if (input) {
                input.setAttribute('aria-invalid', true);
            }

            if (inputValidationMsg) {
                inputValidationMsg.textContent = errorMsg;
                inputValidationMsg.classList.add('visible');
            }
        }

        registerValidationMsg.textContent = error.message;
        registerValidationMsg.classList.add('visible');
    }
}
