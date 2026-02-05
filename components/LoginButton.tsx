"use client";

import { prepareGoogleLogin } from "@/utils/zklogin";
import { Button, Dropdown, Avatar } from "antd";
import { GoogleOutlined, UserOutlined, LogoutOutlined, DashboardOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export function LoginButton() {
  const { isAuthenticated, address, logout } = useAuth();

  const handleLogin = async () => {
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
              label: <Link href="/dashboard">Go to Dashboard</Link>,
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
    <Button 
      type="primary" 
      icon={<GoogleOutlined />} 
      onClick={handleLogin}
      size="large"
      className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 flex items-center gap-2 shadow-sm"
    >
      Đăng nhập bằng Google
    </Button>
  );
}
