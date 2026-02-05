'use client';

import React, { useState, useMemo } from 'react';
import { Table, Tag, Button, Tabs, Card, Statistic, Space, ConfigProvider, Typography, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
const { Title, Text } = Typography;
import {
    WalletOutlined,
    PlusOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { DealTimeline } from '@/components/DealTimeline';
import { ActivityLogBubble, LogMessage as UILogMessage } from '@/components/ActivityLogBubble';

const BRAND_COLOR = '#003366';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { useEscrowEvents, Transaction } from '@/hooks/useEscrowEvents';

const Dashboard = () => {
    const [api, contextHolder] = notification.useNotification();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('buyer');
    const { address } = useAuth();
    
    // Use the shared hook for events and logs
    const { transactions: realTransactions, logs } = useEscrowEvents((tx) => {
        api.info({
            message: 'Hợp đồng mới!',
            description: `Bạn vừa nhận được một yêu cầu hợp đồng mới (${tx.amount}) từ ${tx.counterparty.slice(0, 6)}...`,
            placement: 'bottomRight',
        });
    });

    // Fetch Wallet Balance
    const { data: balanceData } = useSuiClientQuery(
        "getBalance",
        { owner: address || "" },
        { enabled: !!address }
    );

    const walletBalance = useMemo(() => {
        if (!balanceData) return "0";
        return (Number(balanceData.totalBalance) / 1_000_000_000).toLocaleString(undefined, { minimumFractionDigits: 2 });
    }, [balanceData]);

    // Dashboard only shows recent 5 transactions
    const displayData = useMemo(() => ({
        asBuyer: realTransactions.asBuyer.slice(0, 5),
        asSeller: realTransactions.asSeller.slice(0, 5)
    }), [realTransactions]);

    // Format logs for UI (handling type mismatch)
    const uiLogs: UILogMessage[] = useMemo(() => {
        return logs.map(l => ({
            ...l,
            type: (l.type === 'success' || l.type === 'info') ? l.type : 'info'
        }));
    }, [logs]);

    // Calculate Summary Stats dynamically
    const stats = useMemo(() => {
        const parseAmount = (amt: string) => parseFloat(amt.replace(' SUI', '').replace(',', '')) || 0;
        const totalSui = [...realTransactions.asBuyer, ...realTransactions.asSeller].reduce((acc, tx) => acc + parseAmount(tx.amount), 0);
        
        return {
            totalLocked: totalSui,
            activeDeals: realTransactions.asBuyer.length + realTransactions.asSeller.length,
            completedDeals: 0,
            expiringSoon: 0
        };
    }, [realTransactions]);

    const columns: ColumnsType<Transaction> = [
        {
            title: 'Mã Giao dịch',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <span className="font-semibold">{text}</span>
        },
        { 
            title: 'Đối tác', 
            dataIndex: 'counterparty', 
            key: 'counterparty',
            render: (addr: string) => <Text className="font-mono text-xs" title={addr}>{addr.slice(0, 6)}...{addr.slice(-4)}</Text>
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (val) => <span className="text-[#003366] font-bold">{val}</span>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'blue';
                let text = status;
                if (status === 'FUNDED') { color = 'cyan'; text = 'Đã Cọc'; }
                if (status === 'ACTIVE') { color = 'processing'; text = 'Đang Xử Lý'; } 
                if (status === 'COMPLETED') { color = 'success'; text = 'Hoàn Tất'; }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === 'FUNDED' && <Button type="primary" size="small">Chấp nhận</Button>}
                    {record.status === 'ACTIVE' && record.type === 'buyer' && <Button danger size="small">Giải ngân</Button>}
                    {record.status === 'ACTIVE' && record.type === 'seller' && <Button disabled size="small">Chờ duyệt</Button>}
                    {record.status === 'COMPLETED' && <span className="text-gray-400 text-xs">Không có hành động</span>}
                </Space>
            ),
        },
    ];

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: BRAND_COLOR,
                    borderRadius: 8,
                },
            }}
        >
            {contextHolder}
            <div className="min-h-screen bg-[#f8f9fa] p-6 md:p-8 font-sans">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <WalletOutlined className="text-2xl text-[#003366]" />
                        </div>
                        <div>
                            <Title level={4} className="!m-0 text-slate-800">Chào mừng trở lại!</Title>
                            <div className="flex items-center gap-2">
                                <Text type="secondary" className="text-xs font-mono" title={address || ''}>
                                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                                </Text>
                                <Tag color="blue" className="!m-0 text-[10px] scale-90">Sui Testnet</Tag>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 flex-1 md:flex-initial">
                            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Số dư:</span>
                            <span className="text-[#003366] font-bold">{walletBalance} SUI</span>
                        </div>
                        <Button 
                            type="primary" 
                            size="large"
                            icon={<PlusOutlined />}
                            className="bg-[#003366] hover:bg-[#004488] border-none shadow-lg h-10 px-6 rounded-lg font-bold"
                            onClick={() => router.push('/dashboard/create')}
                        >
                            Tạo Giao dịch
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
                    <Card className="shadow-sm border-none bg-white rounded-xl">
                        <Statistic 
                            title={<span className="text-xs font-bold text-slate-400 uppercase">Ví của tôi</span>}
                            value={walletBalance} 
                            suffix="SUI"
                            valueStyle={{ color: '#003366', fontWeight: 800, fontSize: '24px' }}
                        />
                    </Card>
                    <Card className="shadow-sm border-none bg-white rounded-xl">
                        <Statistic 
                            title={<span className="text-xs font-bold text-slate-400 uppercase">Tổng tài sản khoá</span>}
                            value={stats.totalLocked} 
                            suffix="SUI"
                            valueStyle={{ color: '#003366', fontWeight: 800, fontSize: '24px' }}
                        />
                    </Card>
                    <Card className="shadow-sm border-none bg-white rounded-xl">
                        <Statistic 
                            title={<span className="text-xs font-bold text-slate-400 uppercase">Giao dịch active</span>}
                            value={stats.activeDeals} 
                            prefix={<ClockCircleOutlined className="text-amber-500 scale-75" />}
                            valueStyle={{ color: '#334155', fontWeight: 800 }}
                        />
                    </Card>
                    <Card className="shadow-sm border-none bg-white rounded-xl">
                        <Statistic 
                            title={<span className="text-xs font-bold text-slate-400 uppercase">Đã hoàn thành</span>}
                            value={stats.completedDeals} 
                            prefix={<CheckCircleOutlined className="text-green-500 scale-75" />}
                            valueStyle={{ color: '#334155', fontWeight: 800 }}
                        />
                    </Card>
                    <Card className="shadow-sm border-none bg-white rounded-xl">
                        <Statistic 
                            title={<span className="text-xs font-bold text-slate-400 uppercase">Sắp hết hạn</span>}
                            value={stats.expiringSoon} 
                            valueStyle={{ color: '#ef4444', fontWeight: 800 }}
                        />
                    </Card>
                </div>

                {/* Status Alert for Demo - Optional */}
                {/* <Alert message="Thông báo" description="Bạn vui lòng nạp tiền vào hợp đồng để bắt đầu." type="warning" showIcon closable className="mb-8" /> */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <Card title={<span className="text-slate-700 font-bold">Trình theo dõi (Demo)</span>} className="lg:col-span-2 shadow-sm border-none rounded-xl overflow-hidden">
                        <div className="bg-slate-50 p-4 rounded-lg mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                           <div className="flex items-center gap-3">
                               <ClockCircleOutlined className="text-xl text-amber-500" />
                               <div>
                                   <div className="text-sm font-bold text-slate-700">Trạng thái: Đang vận chuyển</div>
                                   <div className="text-xs text-slate-400">Cập nhật lúc 14:30 hôm nay</div>
                               </div>
                           </div>
                           <Button 
                                type="primary" 
                                ghost 
                                className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
                           >
                                Xem chi tiết
                           </Button>
                        </div>
                        <DealTimeline currentStep={1} />
                    </Card>

                    <Card title={<span className="text-slate-700 font-bold">Hoạt động mới nhất</span>} className="shadow-sm border-none rounded-xl">
                        <ActivityLogBubble logs={uiLogs} />
                    </Card>
                </div>

                {/* Main Content */}
                <Card className="shadow-md rounded-xl border-none">
                    <Tabs 
                        defaultActiveKey="buyer"
                        activeKey={activeTab} 
                        onChange={(key) => setActiveTab(key)}
                    >
                        <Tabs.TabPane
                            tab={
                                <span className="px-2 flex items-center gap-2">
                                    <ArrowDownOutlined /> Là Người Mua (Buyer)
                                </span>
                            }
                            key="buyer"
                        >
                            <Table
                                rowKey="id"
                                columns={columns}
                                dataSource={displayData.asBuyer}
                                pagination={false}
                                className="border border-slate-100 rounded-lg overflow-hidden"
                                locale={{ emptyText: 'Chưa có giao dịch mua nào.' }}
                                footer={() => (
                                    <div className="text-center py-2">
                                        <Button type="link" onClick={() => router.push('/dashboard/history')} className="text-[#003366] font-semibold">
                                            Xem tất cả lịch sử mua hàng
                                        </Button>
                                    </div>
                                )}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab={
                                <span className="px-2 flex items-center gap-2">
                                    <ArrowUpOutlined /> Là Người Bán (Seller)
                                </span>
                            }
                            key="seller"
                        >
                            <Table
                                rowKey="id"
                                columns={columns}
                                dataSource={displayData.asSeller}
                                pagination={false}
                                className="border border-slate-100 rounded-lg overflow-hidden"
                                locale={{ emptyText: 'Chưa có giao dịch bán nào.' }}
                                footer={() => (
                                    <div className="text-center py-2">
                                        <Button type="link" onClick={() => router.push('/dashboard/history')} className="text-[#003366] font-semibold">
                                            Xem tất cả lịch sử bán hàng
                                        </Button>
                                    </div>
                                )}
                            />
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
            </div>
        </ConfigProvider>
    );
};

export default Dashboard;