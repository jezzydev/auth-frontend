import * as auth from './auth.js';
import * as api from './api.js';
import * as util from './utils.js';

const logoutBtn = document.querySelector('#logout-btn');
const profileValidationMsg = document.querySelector('.profile .validation-msg');
let countdownInterval;

logoutBtn.addEventListener('click', async () => {
    try {
        clearInterval(countdownInterval);
        await api.logout();
        window.location.replace('./index.html');
        return;
    } catch (error) {
        profileValidationMsg.textContent = error.message;
    }
});

const msInADay = 86400000;
const msInAnHour = 3600000;
const msInAMin = 60000;
const msInASec = 1000;
let tokenTimeRemaining;

(async () => {
    try {
        if (!auth.isLoggedIn()) {
            const refreshed = await api.tryRefresh();

            if (!refreshed) {
                window.location.replace('./index.html');
                return;
            }
        }

        const user = util.extractUserData(auth.getToken());

        if (user.role === 'admin') {
            const adminPanelBtn = document.querySelector('#admin-panel-btn');

            adminPanelBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                clearInterval(countdownInterval);
                window.location.assign('./admin.html');
            });

            adminPanelBtn.classList.add('visible');
        }

        const profile = await api.getUserProfile();

        const name = document.querySelector('#name-value');
        name.textContent = profile.name;

        const email = document.querySelector('#email-value');
        email.textContent = profile.email;

        const role = document.querySelector('#role-value');
        role.textContent = profile.role;

        const memberSince = document.querySelector('#member-since-value');
        const date = new Date(profile.created_at);
        const month = date.toLocaleString('default', { month: 'long' });
        memberSince.textContent = `${month} ${date.getFullYear()}`;

        //Token expiry countdown
        const issuedTimestamp = user.iat * 1000;
        const expirationTimestamp = user.exp * 1000;
        tokenTimeRemaining = expirationTimestamp - issuedTimestamp;

        countdownInterval = resetCountdown();

        const checkCountdown = setInterval(async () => {
            if (tokenTimeRemaining < msInAMin) {
                if (tokenTimeRemaining <= 0) {
                    clearInterval(checkCountdown);
                }

                const refreshed = await api.tryRefresh();

                if (refreshed) {
                    clearInterval(countdownInterval);
                    tokenTimeRemaining = expirationTimestamp - issuedTimestamp;
                    countdownInterval = resetCountdown();
                }
            }
        }, 2000);
    } catch (error) {
        profileValidationMsg.textContent = error.message;
    }
})();

function resetCountdown() {
    return setInterval(() => {
        const daysValue = document.querySelector('#token-expires-daysNum');
        const hourValue = document.querySelector('#token-expires-hourNum');
        const minValue = document.querySelector('#token-expires-minNum');
        const secValue = document.querySelector('#token-expires-secNum');

        const days = Math.trunc(tokenTimeRemaining / msInADay);
        let rem = tokenTimeRemaining - days * msInADay;
        const hours = Math.trunc(rem / msInAnHour);
        rem = rem - hours * msInAnHour;
        const min = Math.trunc(rem / msInAMin);
        rem = rem - min * msInAMin;
        const sec = Math.trunc(rem / msInASec);

        daysValue.textContent = days;
        hourValue.textContent = hours;
        minValue.textContent = min;
        secValue.textContent = sec;

        tokenTimeRemaining = tokenTimeRemaining - 1000;
    }, 1000);
}
