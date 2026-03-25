import * as auth from './auth.js';

export const login = async (data) => {
    const PATH = '/api/auth/login';

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

    if (response.ok) {
        const result = await response.json();
        auth.setToken(result.access_token);
    } else {
        const error = await response.json();
        throw new Error(
            error.message ||
                'Something went wrong. Try logging in again later.',
        );
    }
};

export const register = async (data) => {
    const PATH = '/api/auth/register';

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

    if (response.ok) {
        if (response.status === 201) {
            return true;
        } else return false;
    } else {
        const error = await response.json();
        throw new Error(
            error.message ||
                'Network error. Unable to register user. Try again later.',
        );
    }
};

export const getUserProfile = async () => {
    const PATH = '/api/users/me';

    const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${PATH}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${auth.getToken()}`,
            },
        },
    );

    if (response.ok) {
        const result = await response.json();
        return result.profile;
    } else {
        const error = await response.json();
        throw new Error(
            error.message || 'Something went wrong. Try again later.',
        );
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

    const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${PATH}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${auth.getToken()}`,
            },
        },
    );

    if (response.ok) {
        auth.clearToken();
    } else {
        throw new Error('Logout failed. Try again or close your browser.');
    }
};
