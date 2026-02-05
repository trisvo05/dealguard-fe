import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const EXPIRATION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const router = useRouter();

  const logout = useCallback(() => {
    window.localStorage.removeItem("sui_address");
    window.localStorage.removeItem("zklogin_jwt");
    window.localStorage.removeItem("zklogin_user_salt");
    window.localStorage.removeItem("auth_expiry");
    
    setIsAuthenticated(false);
    setAddress(null);
    router.push("/");
  }, [router]);

  const checkAuth = useCallback(() => {
    const storedAddress = window.localStorage.getItem("sui_address");
    const expiry = window.localStorage.getItem("auth_expiry");

    if (storedAddress && expiry) {
      if (Date.now() < parseInt(expiry, 10)) {
        setIsAuthenticated(true);
        setAddress(storedAddress);
      } else {
        logout(); // Expired
      }
    } else {
      setIsAuthenticated(false);
      setAddress(null);
    }
  }, [logout]);

  useEffect(() => {
    // Wrap in timeout to avoid synchronous setState warning during render
    const timer = setTimeout(() => {
        checkAuth();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  const login = (address: string, idToken: string, salt: string) => {
    const expiry = (Date.now() + EXPIRATION_DURATION).toString();
    window.localStorage.setItem("sui_address", address);
    window.localStorage.setItem("zklogin_jwt", idToken);
    window.localStorage.setItem("zklogin_user_salt", salt);
    window.localStorage.setItem("auth_expiry", expiry);
    
    setIsAuthenticated(true);
    setAddress(address);
  };

  return { isAuthenticated, address, login, logout };
}
