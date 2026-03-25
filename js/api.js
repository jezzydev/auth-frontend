import * as auth from './auth.js';

export const login = async (data) => {
    const PATH = '/api/auth/login';

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}${PATH}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            },
        );

        if (!response.ok) {
            const error = parseErrorMsg(await response.text());
            throw new Error(`${error.message}`);
        }

        const result = await response.json();
        auth.setToken(result.access_token);
    } catch (error) {
        throw new Error(`Login failed. ${error.message}`, { cause: error });
    }
};

export const register = async (data) => {
    const PATH = '/api/auth/register';

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}${PATH}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    bdate: data.bdate,
                    role: data.role,
                }),
            },
        );

        if (!response.ok) {
            const error = parseErrorMsg(await response.text());

            if (response.status === 409) {
                error.message = 'Email already exists.';
            }

            throw new Error(`${error.message}`);
        }
        return true;
    } catch (error) {
        throw new Error(`Registration failed.`, {
            cause: error,
        });
    }
};

export const getUserProfile = async () => {
    const PATH = '/api/users/me';

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}${PATH}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${auth.getToken()}`,
                },
            },
        );

        if (!response.ok) {
            const error = parseErrorMsg(await response.text());
            throw new Error(`${error.message}`);
        }

        const result = await response.json();
        return result.profile;
    } catch (error) {
        throw new Error(`There was a problem fetching the user profile.`, {
            cause: error,
        });
    }
};

export const tryRefresh = async () => {
    const PATH = '/api/auth/refresh';

    const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${PATH}`,
        {
            method: 'POST',
            credentials: 'include', //instructs the browser to attach the cookies if frontend and backend are on different origins;
            //if frontend and backend are of same origin, browser attaches the cookies automatically
        },
    );

    if (response.ok) {
        const result = await response.json();
        auth.setToken(result.access_token);
        return true;
    }

    return false;
};

export const logout = async () => {
    const PATH = '/api/auth/logout';

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}${PATH}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${auth.getToken()}`,
                },
            },
        );

        if (!response.ok) {
            //if 401 error, continue to logout; otherwise throw the error
            if (response.status !== 401) {
                const error = parseErrorMsg(await response.text());
                throw new Error(`${error.message}`);
            }
        }

        auth.clearToken();
    } catch (error) {
        throw new Error(`Logout failed. Try again or close your browser.`, {
            cause: error,
        });
    }
};

function parseErrorMsg(text) {
    try {
        const json = JSON.parse(text);
        return json;
    } catch (error) {
        return { message: text };
    }
}
