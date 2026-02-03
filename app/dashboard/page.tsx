'use client';
import React, { useState, useMemo } from 'react';
import { Table, Tag, Button, Tabs, Card, Statistic, Space, ConfigProvider, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    WalletOutlined,
    PlusOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';

// Define Types
interface Transaction {
    id: string;
    counterparty: string;
    amount: string;
    status: 'FUNDED' | 'ACTIVE' | 'COMPLETED';
    type: 'buyer' | 'seller';
}

const BRAND_COLOR = '#003366';

const mockData: { asBuyer: Transaction[]; asSeller: Transaction[] } = {
    asBuyer: [
        { id: '#12', counterparty: '0xA1…B9', amount: '500 USDC', status: 'FUNDED', type: 'buyer' },
        { id: '#15', counterparty: '0xC2…D8', amount: '1,200 USDC', status: 'ACTIVE', type: 'buyer' },
    ],
    asSeller: [
        { id: '#18', counterparty: '0xE3…F7', amount: '300 USDC', status: 'ACTIVE', type: 'seller' },
        { id: '#20', counterparty: '0xF4…G1', amount: '2,500 USDC', status: 'COMPLETED', type: 'seller' },
    ]
};

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('buyer');

    // Columns definition wrapped in useMemo to prevent unnecessary re-renders
    const columns: ColumnsType<Transaction> = useMemo(() => [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <span className="font-semibold">{text}</span>
        },
        { title: 'Counterparty', dataIndex: 'counterparty', key: 'counterparty' },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (val) => <span className="text-[#003366] font-bold">{val}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'blue';
                if (status === 'FUNDED') color = 'cyan';
                if (status === 'ACTIVE') color = 'processing'; // AntD default blue
                if (status === 'COMPLETED') color = 'success';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === 'FUNDED' && <Button type="primary" size="small">Accept</Button>}
                    {record.status === 'ACTIVE' && record.type === 'buyer' && <Button danger size="small">Release</Button>}
                    {record.status === 'ACTIVE' && record.type === 'seller' && <Button disabled size="small">Wait</Button>}
                    {record.status === 'COMPLETED' && <span className="text-gray-400 text-xs">No Action</span>}
                </Space>
            ),
        },
    ], []);

    return (
        // ConfigProvider handles the global theme colors automatically
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: BRAND_COLOR,
                    borderRadius: 8,
                },
            }}
        >
            <div className="min-h-screen bg-[#f8f9fa] p-6 md:p-8 font-sans">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#003366] m-0">DealGuard Dashboard</h1>
                        <p className="text-gray-500 m-0">B2B On-chain Escrow Platform</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="bg-white px-4 py-2 rounded-lg border flex items-center gap-3 shadow-sm flex-1 md:flex-none justify-between md:justify-start">
                            <WalletOutlined className="text-[#003366] text-xl" />
                            <div className="text-right">
                                <p className="text-[10px] uppercase text-gray-400 font-bold m-0 leading-tight">Connected Wallet</p>
                                <p className="text-sm font-mono font-medium m-0 text-[#003366]">0x71C...8921</p>
                            </div>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            className="flex items-center shadow-md"
                        >
                            Create Escrow
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                        <Statistic title="Total Locked" value={1700} precision={2} suffix="USDC" valueStyle={{ color: BRAND_COLOR, fontWeight: 'bold' }} />
                    </Card>
                    <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                        <Statistic title="Active Deals" value={3} prefix={<ClockCircleOutlined />} valueStyle={{ color: BRAND_COLOR, fontWeight: 'bold' }} />
                    </Card>
                    <Card className="border-l-4 border-l-gray-400 shadow-sm hover:shadow-md transition-shadow">
                        <Statistic title="Completed" value={12} prefix={<CheckCircleOutlined />} valueStyle={{ color: BRAND_COLOR, fontWeight: 'bold' }} />
                    </Card>
                    <Card className="border-l-4 border-l-orange-400 shadow-sm hover:shadow-md transition-shadow">
                        <Statistic title="Expiring Soon" value={1} valueStyle={{ color: '#faad14', fontWeight: 'bold' }} />
                    </Card>
                </div>

                {/* Main Content */}
                <Card className="shadow-md rounded-xl border-none">
                    <Tabs
                        defaultActiveKey="buyer"
                        onChange={(key) => setActiveTab(key)}
                        items={[
                            {
                                key: 'buyer',
                                label: (
                                    <span className="px-2 flex items-center gap-2">
                                        <ArrowDownOutlined /> As Buyer
                                    </span>
                                ),
                                children: (
                                    <Table
                                        columns={columns}
                                        dataSource={mockData.asBuyer}
                                        pagination={false}
                                        className="mt-2"
                                        scroll={{ x: 600 }} // Handles horizontal scroll on mobile
                                    />
                                ),
                            },
                            {
                                key: 'seller',
                                label: (
                                    <span className="px-2 flex items-center gap-2">
                                        <ArrowUpOutlined /> As Seller
                                    </span>
                                ),
                                children: (
                                    <Table
                                        columns={columns}
                                        dataSource={mockData.asSeller}
                                        pagination={false}
                                        className="mt-2"
                                        scroll={{ x: 600 }}
                                    />
                                ),
                            },
                        ]}
                    />
                </Card>
            </div>
        </ConfigProvider>
    );
};

export default Dashboard;