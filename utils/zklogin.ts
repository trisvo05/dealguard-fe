import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { generateNonce, generateRandomness } from "@mysten/zklogin";
import { decodeJwt } from "jose";

const PROVER_URL = process.env.NEXT_PUBLIC_ZKP_PROVER_URL || "https://prover-dev.mystenlabs.com/v1";
const REDIRECT_URI = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export const generateEphemeralKeyPair = () => {
    const keyPair = new Ed25519Keypair();
    return keyPair;
};

export const prepareGoogleLogin = async () => {
    if (!CLIENT_ID) throw new Error("Google Client ID not found");

    const ephemeralKeyPair = generateEphemeralKeyPair();
    const randomness = generateRandomness();
    const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), 1000 * 60 * 60 * 24, randomness); // 1 day expiry estimate

    // Store in session storage
    window.sessionStorage.setItem("zklogin_ephemeral_key", ephemeralKeyPair.getSecretKey());
    window.sessionStorage.setItem("zklogin_randomness", randomness);
    window.sessionStorage.setItem("zklogin_nonce", nonce);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "id_token",
        redirect_uri: REDIRECT_URI,
        scope: "openid email profile",
        nonce: nonce,
        // state: ... // optional but recommended for CSRF
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const clearZkLoginSession = () => {
    window.sessionStorage.removeItem("zklogin_ephemeral_key");
    window.sessionStorage.removeItem("zklogin_randomness");
    window.sessionStorage.removeItem("zklogin_nonce");
    window.sessionStorage.removeItem("zklogin_jwt");
    window.sessionStorage.removeItem("zklogin_user_salt");
};
