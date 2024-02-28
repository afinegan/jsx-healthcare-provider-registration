export const getPublicEncryptionKey = async () => {
    // public ket fetch will ALWAYS come from the server through HTTPS
    // since we dont have a server to give us this key, I am supplying it through the public folder
    // this part of the code will have to change to be secure to get a proper rotated public key from server
    try {
        const response = await fetch('/examplePublic.key'); // Path relative to the public directory
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Could not fetch the file: ", error);
    }
}

export const encryptWithPublicKey = async (plainText, publicKey) => {
    const enc = new TextEncoder();
    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey,
        enc.encode(plainText)
    );
    return new Uint8Array(encrypted);
}

export const importPublicKey = async (pem) => {
    // Fetch or otherwise obtain the PEM-encoded public key string
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    const binaryDerString = window.atob(pemContents);
    const binaryDer = str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["encrypt"]
    );
}

const str2ab = (str) => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}