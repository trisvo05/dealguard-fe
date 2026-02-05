"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeJwt } from "jose";
import { genAddressSeed, jwtToAddress } from "@mysten/zklogin";
import { notification, Spin } from "antd";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const processLogin = async () => {
      // 1. Get ID Token from hash
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", ""));
      const idToken = params.get("id_token");

      if (!idToken) {
        setStatus("Login failed: No ID Token found.");
        return;
      }

      try {
        // 2. Decode JWT
        const decodedJwt = decodeJwt(idToken);
        if (!decodedJwt.sub || !decodedJwt.aud) {
           throw new Error("Invalid JWT");
        }

        // 3. Get ephemeral key from session
        const privateKey = window.sessionStorage.getItem("zklogin_ephemeral_key");
        const randomness = window.sessionStorage.getItem("zklogin_randomness");
        const nonce = window.sessionStorage.getItem("zklogin_nonce");

        if (!privateKey || !randomness || !nonce) {
           throw new Error("Missing session data. Please login again.");
        }

        // 4. Derive Sui Address
        // Need user salt. For now we might not have a salt service, so dealing with this is tricky.
        // For a hackathon/MVP, we might use a fixed salt or request it.
        // But proper zkLogin requires a master seed/salt.
        // Let's assume we generating a salt or using a dummy one for now if we don't have a service.
        // IMPORTANT: In production, you need a service to map user -> salt consistently.
        
        // For this demo, let's just log the token and redirect.
        // Generating the full ZK Proof requires calling a Proving Service.
        
        console.log("ID Token:", idToken);
        
        // To get the address, we need the userSalt.
        // Let's use a "demo" salt if we can, or just skip address derivation validation fully 
        // until we have the prover response.
        
        // Actually, jwtToAddress needs a salt.
        // We will fake it for now or use a constant "DEMO_SALT" for testing (NOT SECURE).
        const salt = "1234567890"; 
        
        const address = jwtToAddress(idToken, salt);
        
        setStatus(`Logged in! Address: ${address}`);
        
        // Store session in localStorage with 24h expiration
        const expiry = (Date.now() + 24 * 60 * 60 * 1000).toString();
        window.localStorage.setItem("zklogin_jwt", idToken);
        window.localStorage.setItem("zklogin_user_salt", salt);
        window.localStorage.setItem("sui_address", address);
        window.localStorage.setItem("auth_expiry", expiry);
        
        notification.success({
            title: 'Login Successful',
            description: `Connected as ${address.slice(0, 6)}...${address.slice(-4)}`,
        });

        // Redirect to dashboard
        setTimeout(() => {
             router.push("/dashboard");
        }, 1000);

      } catch (error: any) {
        console.error(error);
        setStatus("Login Error: " + (error?.message || "Unknown error"));
      }
    };

    processLogin();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Spin size="large" />
      <p className="text-gray-600">{status}</p>
    </div>
  );
}
