import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

const EXPIRATION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useAuth() {
  const [zkAuthenticated, setZkAuthenticated] = useState(false);
  const [zkAddress, setZkAddress] = useState<string | null>(null);
  
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const router = useRouter();

  // Unified State
  const isAuthenticated = !!currentAccount || zkAuthenticated;
  const address = currentAccount?.address || zkAddress;

  // 1. Monitor Standard Wallet and sync to LocalStorage for 24h persistence
  useEffect(() => {
    if (currentAccount) {
        const expiry = (Date.now() + EXPIRATION_DURATION).toString();
        window.localStorage.setItem("sui_address", currentAccount.address);
        window.localStorage.setItem("auth_expiry", expiry);
        window.localStorage.setItem("auth_type", "wallet");
    }
  }, [currentAccount]);

  const logout = useCallback(() => {
    disconnect();
    window.localStorage.removeItem("sui_address");
    window.localStorage.removeItem("zklogin_jwt");
    window.localStorage.removeItem("zklogin_user_salt");
    window.localStorage.removeItem("auth_expiry");
    window.localStorage.removeItem("auth_type");
    
    setZkAuthenticated(false);
    setZkAddress(null);
    router.push("/");
  }, [disconnect, router]);

  const checkAuthPersistence = useCallback(() => {
    const storedAddress = window.localStorage.getItem("sui_address");
    const expiry = window.localStorage.getItem("auth_expiry");
    const type = window.localStorage.getItem("auth_type");

    if (storedAddress && expiry) {
      if (Date.now() < parseInt(expiry, 10)) {
        if (type === "zk") {
          setZkAuthenticated(true);
          setZkAddress(storedAddress);
        }
        // For 'wallet' type, dapp-kit's autoConnect will handle currentAccount
      } else {
        // Session expired
        logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuthPersistence();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkAuthPersistence]);

  const loginZk = (address: string, idToken: string, salt: string) => {
    const expiry = (Date.now() + EXPIRATION_DURATION).toString();
    window.localStorage.setItem("sui_address", address);
    window.localStorage.setItem("zklogin_jwt", idToken);
    window.localStorage.setItem("zklogin_user_salt", salt);
    window.localStorage.setItem("auth_expiry", expiry);
    window.localStorage.setItem("auth_type", "zk");
    
    setZkAuthenticated(true);
    setZkAddress(address);
  };

  return { isAuthenticated, address, login: loginZk, logout };
}
