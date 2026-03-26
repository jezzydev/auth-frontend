export const extractUserData = (accessToken) => {
    const payload = accessToken.split('.')[1];
    return JSON.parse(decodeFromBase64(payload));
};

export const decodeFromBase64 = (encodedString) => {
    const bytes = Uint8Array.fromBase64(encodedString);
    return new TextDecoder().decode(bytes);
};
