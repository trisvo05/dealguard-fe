"use client";

import { prepareGoogleLogin } from "@/utils/zklogin";
import { Button, Dropdown, Avatar } from "antd";
import { GoogleOutlined, UserOutlined, LogoutOutlined, DashboardOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { ConnectButton } from "@mysten/dapp-kit";
import Link from "next/link";
import '@mysten/dapp-kit/dist/index.css'; // Ensure CSS is imported

export function LoginButton() {
  const { isAuthenticated, address, logout } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const url = await prepareGoogleLogin();
      window.location.href = url;
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isAuthenticated && address) {
      const items = [
          {
              key: 'dashboard',
              label: <Link href="/dashboard">Dashboard</Link>,
              icon: <DashboardOutlined />,
          },
          {
              key: 'logout',
              label: 'Logout',
              icon: <LogoutOutlined />,
              onClick: logout,
              danger: true,
          },
      ];

      return (
          <Dropdown menu={{ items }} placement="bottomRight">
               <Button size="large" className="flex items-center gap-2 border-none shadow-sm">
                  <Avatar size="small" icon={<UserOutlined />} className="bg-[#003366]" />
                  <span className="font-semibold text-[#003366] hidden md:inline">
                      {address.slice(0, 5)}...{address.slice(-4)}
                  </span>
               </Button>
          </Dropdown>
      );
  }

  return (
    <div className="flex items-center gap-2">
        {/* Option 1: Standard Wallet Connect */}
        <ConnectButton 
            className="!bg-[#003366] !text-white !font-semibold !h-10 !rounded-lg hover:!opacity-90 transition-opacity"
            connectText="Kết nối Ví"
        />
        
        <span className="text-gray-400 text-sm">hoặc</span>

        {/* Option 2: Google Login */}
        <Button 
            icon={<GoogleOutlined />} 
            onClick={handleGoogleLogin}
            size="large"
            className="flex items-center gap-2 border-gray-300 shadow-sm"
        >
            Google
        </Button>
    </div>
  );
}
