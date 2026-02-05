'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, ConfigProvider, theme } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    HistoryOutlined,
    SettingOutlined,
    PlusOutlined
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
            label: 'Tổng quan',
        },
        {
            key: '/dashboard/history',
            icon: <HistoryOutlined />,
            label: 'Lịch sử giao dịch',
        },
        {
            key: '/dashboard/settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
        }
    ];

    // userMenu was unused and has been removed for cleanup

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: BRAND_COLOR,
                },
            }}
        >
            <Layout className="h-screen overflow-hidden">
                {/* SIDEBAR */}
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width={260}
                    className="shadow-xl z-20 relative" // Added relative for absolute positioning of children
                    style={{ background: '#002244' }}
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
                    
                    {/* Bottom Left Floating Button (Create) - Symmetric to Chat Button */}
                    <div className="absolute bottom-8 left-0 w-full flex justify-center z-50">
                        {collapsed ? (
                             <Button 
                                type="primary" 
                                shape="circle" 
                                size="large"
                                icon={<PlusOutlined />}
                                className="bg-gradient-to-r from-blue-500 to-cyan-400 border-none shadow-lg hover:scale-110 transition-transform"
                                onClick={() => router.push('/dashboard/create')}
                                title="Tạo giao dịch mới"
                             />
                        ) : (
                             <Button 
                                type="primary" 
                                size="large"
                                icon={<PlusOutlined />}
                                className="w-4/5 bg-gradient-to-r from-blue-500 to-cyan-400 border-none shadow-lg hover:scale-105 transition-transform font-bold h-12 rounded-full"
                                onClick={() => router.push('/dashboard/create')}
                             >
                                Tạo Giao dịch
                            </Button>
                        )}
                    </div>
                </Sider>

                {/* MAIN LAYOUT */}
                <Layout className="flex flex-col h-full overflow-hidden">
                    {/* HEADER */}
                    <Header
                        style={{ padding: 0, background: colorBgContainer }}
                        className="flex items-center justify-between shadow-sm px-4 shrink-0"
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
                        className="overflow-y-auto flex-1 p-6"
                        style={{
                            // Removed margin to let scrollbar fit edge, using padding instead
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