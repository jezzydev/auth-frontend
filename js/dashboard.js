import * as auth from './auth.js';
import * as api from './api.js';

const logoutBtn = document.getElementById('logoutBtn');
const profileValidationMsg = document.querySelector('.profile .validation-msg');

logoutBtn.addEventListener('click', async () => {
    try {
        await api.logout();
        window.location.replace('../index.html');
        return;
    } catch (error) {
        profileValidationMsg.textContent = error.message;
    }
});

(async () => {
    try {
        if (!auth.isLoggedIn()) {
            const refreshed = await api.tryRefresh();

            if (!refreshed) {
                window.location.replace('../index.html');
                return;
            }
        }

        const profile = await api.getUserProfile();

        const name = document.getElementById('nameValue');
        name.textContent = profile.name;

        const email = document.getElementById('emailValue');
        email.textContent = profile.email;

        const role = document.getElementById('roleValue');
        role.textContent = profile.role;

        const memberSince = document.getElementById('memberSinceValue');
        const date = new Date(profile.created_at);
        const month = date.toLocaleString('default', { month: 'long' });
        memberSince.textContent = `${month} ${date.getFullYear()}`;

        //TODO: Bonus: show token countdown timer
    } catch (error) {
        profileValidationMsg.textContent = error.message;
    }
})();
