'use client';

import React, { useState, useMemo } from 'react';
import { Table, Tag, Button, Tabs, Card, Statistic, Space, ConfigProvider, Typography } from 'antd';
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
import { ActivityLogBubble, LogMessage } from '@/components/ActivityLogBubble';

// Define Types
interface Transaction {
    id: string;
    counterparty: string;
    amount: string;
    status: 'FUNDED' | 'ACTIVE' | 'COMPLETED';
    type: 'buyer' | 'seller';
}

const BRAND_COLOR = '#003366';

// Mock data has been removed to use real blockchain data
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSuiClient, useSuiClientQuery } from '@mysten/dapp-kit';

const Dashboard = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('buyer');
    const { address } = useAuth(); // Use unified auth hook
    const [demoStep, setDemoStep] = useState(1); // Default to "Shipping" step
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [realTransactions, setRealTransactions] = useState<{ asBuyer: Transaction[]; asSeller: Transaction[] }>({ asBuyer: [], asSeller: [] });
    const client = useSuiClient();

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

    // Fetch Real Data from Events
    React.useEffect(() => {
        const fetchEvents = async () => {
            if (!address) return;
            // TODO: Replace with Real Package ID
            const PACKAGE_ID = "0x085260c1fcb11036d90b859999b9d1b1b9785f2f5d07ea872f3fb543f7066022"; 

            // Prevent fetching if Package ID is not set
            if (PACKAGE_ID.includes("REPLACE")) {
                console.warn("Package ID not set. Skipping event fetch.");
                return;
            }

            try {
                if (!client) return;
                
                // Query events where User is Buyer or Seller
                const events = await client.queryEvents({
                    query: {
                        MoveModule: {
                            package: PACKAGE_ID,
                            module: 'escrow'
                        }
                    },
                    limit: 50,
                    order: 'descending'
                });

                const newBuyerTxs: Transaction[] = [];
                const newSellerTxs: Transaction[] = [];

                // Interface for parsed event data
                interface EscrowEventParsed {
                    escrow_id: string;
                    buyer: string;
                    seller: string;
                    amount: string;
                }

                events.data.forEach((e) => {
                    const parsed = e.parsedJson as EscrowEventParsed | undefined;
                    if (!parsed) return;

                    // EscrowCreated Event
                    if (e.type.includes('::EscrowCreated')) {
                        const isBuyer = parsed.buyer === address;
                        const isSeller = parsed.seller === address;
                        
                        if (!isBuyer && !isSeller) return;

                        const tx: Transaction = {
                            id:  `${parsed.escrow_id.slice(0, 6)}...${parsed.escrow_id.slice(-4)}`,
                            counterparty: isBuyer ? parsed.seller : parsed.buyer,
                            amount: (Number(parsed.amount) / 1_000_000_000).toLocaleString() + ' SUI',
                            status: 'FUNDED', // Initial status
                            type: isBuyer ? 'buyer' : 'seller'
                        };

                        if (isBuyer) newBuyerTxs.push(tx);
                        if (isSeller) newSellerTxs.push(tx);
                    }
                });

                setRealTransactions({
                    asBuyer: newBuyerTxs,
                    asSeller: newSellerTxs
                });

            } catch (err) {
                console.error("Failed to fetch events:", err);
            }
        };

        fetchEvents();
        // Poll every 10s
        const interval = setInterval(fetchEvents, 10000);
        return () => clearInterval(interval);
    }, [address, client]);

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

    // Use only real data from the blockchain
    const displayData = realTransactions;

    // Demo Log Messages Mapping
    const LOG_TEMPLATES = [
        { msg: 'Buyer đã đặt cọc thành công.', type: 'success' }, // Step 0
        { msg: 'Seller đã bắt đầu vận chuyển hàng hóa.', type: 'info' }, // Step 1
        { msg: 'Buyer đã nhận được hàng và đang kiểm tra.', type: 'info' }, // Step 2
        { msg: 'Giao dịch hoàn tất. Tiền đã được giải ngân cho Seller.', type: 'success' } // Step 3
    ];

    const handleSimulate = () => {
        // Calculate next step based on current state
        const nextStep = (demoStep + 1) > 3 ? 0 : demoStep + 1;
        
        // Update Step
        setDemoStep(nextStep);

        // Add Log separately
        const template = LOG_TEMPLATES[nextStep];
        const newLog: LogMessage = {
            id: Date.now().toString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            content: template.msg,
            type: template.type as 'info' | 'success'
        };
        setLogs(prevLogs => [...prevLogs, newLog]);
    };
    
    // address is now managed by useAuth, so manual localStorage effect is removed

    // Columns definition wrapped in useMemo to prevent unnecessary re-renders
    const columns: ColumnsType<Transaction> = useMemo(() => [
        {
            title: 'Mã Giao dịch',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <span className="font-semibold">{text}</span>
        },
        { title: 'Đối tác', dataIndex: 'counterparty', key: 'counterparty' },
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
                if (status === 'ACTIVE') { color = 'processing'; text = 'Đang Xử Lý'; } // AntD default blue
                if (status === 'COMPLETED') { color = 'success'; text = 'Hoàn Tất'; }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === 'FUNDED' && <Button type="primary" size="small">Chấp Nhận</Button>}
                    {record.status === 'ACTIVE' && record.type === 'buyer' && <Button danger size="small">Giải Ngân</Button>}
                    {record.status === 'ACTIVE' && record.type === 'seller' && <Button disabled size="small">Chờ Duyệt</Button>}
                    {record.status === 'COMPLETED' && <span className="text-gray-400 text-xs">Không có hành động</span>}
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
                        <p className="text-gray-500 m-0">Nền tảng Escrow B2B On-chain</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="bg-white px-4 py-2 rounded-lg border flex items-center gap-3 shadow-sm flex-1 md:flex-none justify-between md:justify-start">
                            <WalletOutlined className="text-[#003366] text-xl" />
                            <div className="text-right">
                                <p className="text-[10px] uppercase text-gray-400 font-bold m-0 leading-tight">Ví Đã Kết Nối</p>
                                <div className="flex flex-col items-end">
                                    <p className="text-sm font-mono font-medium m-0 text-[#003366]">
                                        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Chưa Kết Nối'}
                                    </p>
                                    {address && (
                                        <p className="text-[11px] font-bold text-green-600 m-0 leading-tight">
                                            {walletBalance} SUI
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            className="flex items-center shadow-md"
                            onClick={() => router.push('/dashboard/create')}
                        >
                            Tạo Giao dịch
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
                        <Statistic title="Tổng tài sản của tôi" value={walletBalance} precision={2} suffix="SUI" styles={{ content: { color: BRAND_COLOR, fontWeight: 'bold' } }} />
                    </Card>
                    <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                        <Statistic title="Tổng tài sản khoá" value={stats.totalLocked} precision={2} suffix="SUI" styles={{ content: { color: BRAND_COLOR, fontWeight: 'bold' } }} />
                    </Card>
                    <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                        <Statistic title="Giao dịch đang chạy" value={stats.activeDeals} prefix={<ClockCircleOutlined />} styles={{ content: { color: BRAND_COLOR, fontWeight: 'bold' } }} />
                    </Card>
                    <Card className="border-l-4 border-l-gray-400 shadow-sm hover:shadow-md transition-shadow">
                        <Statistic title="Đã hoàn tất" value={stats.completedDeals} prefix={<CheckCircleOutlined />} styles={{ content: { color: BRAND_COLOR, fontWeight: 'bold' } }} />
                    </Card>
                    <Card className="border-l-4 border-l-orange-400 shadow-sm hover:shadow-md transition-shadow">
                        <Statistic title="Sắp hết hạn" value={stats.expiringSoon} styles={{ content: { color: '#faad14', fontWeight: 'bold' } }} />
                    </Card>
                </div>

                {/* Live Deal Timeline (Dynamic) */}
                {([...realTransactions.asBuyer, ...realTransactions.asSeller].length > 0) ? (
                    <Card className="mb-8 shadow-md rounded-xl border-none overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ClockCircleOutlined className="text-6xl text-[#003366]" />
                        </div>
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-[#003366] m-0">Trạng Thái Giao Dịch Gần Nhất</h3>
                                    <p className="text-gray-500 text-xs m-0">ID: {[...realTransactions.asBuyer, ...realTransactions.asSeller][0].id}</p>
                                </div>
                                <Button 
                                    size="small" 
                                    onClick={handleSimulate}
                                >
                                    Giả Lập Tín Hiệu
                                </Button>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <DealTimeline currentStep={demoStep} />
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="mb-8 bg-blue-50 border-dashed border-blue-200 text-center py-6 rounded-xl">
                        <Text type="secondary" italic>Chưa có giao dịch nào trên mạng Sui. Hãy tạo giao dịch đầu tiên!</Text>
                    </Card>
                )}

                {/* Activity Log Bubble */}
                <ActivityLogBubble logs={logs} />

                {/* Main Content */}
                <Card className="shadow-md rounded-xl border-none">
                    <Tabs
                        activeKey={activeTab} // Use controlled state
                        onChange={(key) => setActiveTab(key)}
                        items={[
                            {
                                key: 'buyer',
                                label: (
                                    <span className="px-2 flex items-center gap-2">
                                        <ArrowDownOutlined /> Là Người Mua (Buyer)
                                    </span>
                                ),
                                children: (
                                    <Table
                                        rowKey="id"
                                        columns={columns}
                                        dataSource={displayData.asBuyer}
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
                                        <ArrowUpOutlined /> Là Người Bán (Seller)
                                    </span>
                                ),
                                children: (
                                    <Table
                                        rowKey="id"
                                        columns={columns}
                                        dataSource={displayData.asSeller}
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