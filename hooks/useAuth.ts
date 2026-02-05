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

  const logout = useCallback(() => {
    if (currentAccount) {
        disconnect();
    } else {
        window.localStorage.removeItem("sui_address");
        window.localStorage.removeItem("zklogin_jwt");
        window.localStorage.removeItem("zklogin_user_salt");
        window.localStorage.removeItem("auth_expiry");
        
        setZkAuthenticated(false);
        setZkAddress(null);
    }
    router.push("/");
  }, [currentAccount, disconnect, router]);

  const checkZkAuth = useCallback(() => {
    const storedAddress = window.localStorage.getItem("sui_address");
    const expiry = window.localStorage.getItem("auth_expiry");

    if (storedAddress && expiry) {
      if (Date.now() < parseInt(expiry, 10)) {
        setZkAuthenticated(true);
        setZkAddress(storedAddress);
      } else {
        // Only logout if it was a ZK session
        window.localStorage.removeItem("sui_address"); 
        setZkAuthenticated(false);
        setZkAddress(null);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        checkZkAuth();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkZkAuth]);

  const loginZk = (address: string, idToken: string, salt: string) => {
    const expiry = (Date.now() + EXPIRATION_DURATION).toString();
    window.localStorage.setItem("sui_address", address);
    window.localStorage.setItem("zklogin_jwt", idToken);
    window.localStorage.setItem("zklogin_user_salt", salt);
    window.localStorage.setItem("auth_expiry", expiry);
    
    setZkAuthenticated(true);
    setZkAddress(address);
  };

  return { isAuthenticated, address, login: loginZk, logout };
}
