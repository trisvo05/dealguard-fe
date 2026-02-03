'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, ConfigProvider, theme } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    TransactionOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import Link from 'next/link';

const { Header, Sider, Content } = Layout;

// Định nghĩa màu chủ đạo
const BRAND_COLOR = '#003366';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // Cấu hình Menu Items
    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Overview',
        },
        {
            key: '/dashboard/escrow',
            icon: <SafetyCertificateOutlined />,
            label: 'My Escrows',
        },
        {
            key: '/dashboard/history',
            icon: <HistoryOutlined />,
            label: 'Transaction History',
        },
        {
            key: '/dashboard/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
    ];

    // Menu Dropdown cho User
    const userMenu = (
        <Menu items={[
            { key: '1', label: 'Profile', icon: <UserOutlined /> },
            { key: '2', label: 'Logout', icon: <LogoutOutlined />, danger: true },
        ]} />
    );

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: BRAND_COLOR,
                },
            }}
        >
            <Layout className="h-screen">
                {/* SIDEBAR */}
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width={260}
                    className="shadow-xl z-20"
                    style={{ background: '#002244' }} // Màu nền tối hơn brand color một chút cho Sidebar
                >
                    {/* Logo Area */}
                    <div className="h-16 flex items-center justify-center border-b border-gray-700/50">
                        {collapsed ? (
                            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-[#003366] font-bold text-lg">D</div>
                        ) : (
                            <Link href="/" className="flex items-center gap-3"><span className="text-white text-xl font-bold tracking-wide">DealGuard</span></Link>

                        )}
                    </div>

                    {/* Navigation Menu */}
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['/dashboard']}
                        selectedKeys={[pathname]}
                        onClick={(info) => router.push(info.key)}
                        items={menuItems}
                        style={{ background: 'transparent', marginTop: '10px' }}
                        className="custom-sidebar-menu"
                    />
                </Sider>

                {/* MAIN LAYOUT */}
                <Layout>
                    {/* HEADER */}
                    <Header
                        style={{ padding: 0, background: colorBgContainer }}
                        className="flex items-center justify-between sticky top-0 z-10 shadow-sm px-4"
                    >
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: '16px', width: 64, height: 64 }}
                        />

                    </Header>

                    {/* CONTENT AREA */}
                    <Content
                        style={{
                            margin: '24px 16px',
                            minHeight: 280,
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>

            {/* Global Style overrides for specific sidebar tweaks */}
            <style jsx global>{`
        .custom-sidebar-menu .ant-menu-item-selected {
          background-color: #004488 !important;
          border-radius: 8px; 
          margin-left: 8px;
          margin-right: 8px;
          width: calc(100% - 16px);
        }
      `}</style>
        </ConfigProvider>
    );
}