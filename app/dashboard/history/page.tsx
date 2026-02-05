'use client';

import React, { useState, useMemo } from 'react';
import { 
    Table, 
    Tag, 
    Button, 
    Card, 
    Typography, 
    Input, 
    Select, 
    Space, 
    Breadcrumb,
    Empty,
    Spin
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
    SearchOutlined, 
    FilterOutlined, 
    ArrowLeftOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useEscrowEvents, Transaction } from '@/hooks/useEscrowEvents';

const { Title, Text } = Typography;

const HistoryPage = () => {
    const router = useRouter();
    const { transactions, loading } = useEscrowEvents();
    
    // States for filtering/searching
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'buyer' | 'seller'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'FUNDED' | 'ACTIVE' | 'COMPLETED'>('all');

    // Combine and Filter Data
    const filteredData = useMemo(() => {
        let all = [...transactions.asBuyer, ...transactions.asSeller];
        
        // Sort by newest first
        all.sort((a, b) => b.timestamp - a.timestamp);

        // Filter by Type
        if (filterType !== 'all') {
            all = all.filter(t => t.type === filterType);
        }

        // Filter by Status
        if (filterStatus !== 'all') {
            all = all.filter(t => t.status === filterStatus);
        }

        // Search by ID or Counterparty
        if (searchText) {
            const lowerSearch = searchText.toLowerCase();
            all = all.filter(t => 
                t.id.toLowerCase().includes(lowerSearch) || 
                t.fullId.toLowerCase().includes(lowerSearch) ||
                t.counterparty.toLowerCase().includes(lowerSearch)
            );
        }

        return all;
    }, [transactions, filterType, filterStatus, searchText]);

    const columns: ColumnsType<Transaction> = [
        {
            title: 'Mã Giao dịch',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => (
                <div className="flex flex-col">
                    <span className="font-bold text-[#003366]">{text}</span>
                    <Text type="secondary" className="text-[10px] font-mono break-all line-clamp-1" title={record.fullId}>
                        {record.fullId}
                    </Text>
                </div>
            ),
            width: 180
        },
        {
            title: 'Vai trò',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={type === 'buyer' ? 'blue' : 'green'}>
                    {type === 'buyer' ? 'Người Mua' : 'Người Bán'}
                </Tag>
            ),
            width: 120
        },
        { 
            title: 'Đối tác', 
            dataIndex: 'counterparty', 
            key: 'counterparty',
            render: (addr) => <Text className="font-mono text-xs" title={addr}>{addr.slice(0, 6)}...{addr.slice(-4)}</Text>
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (val) => <span className="font-bold">{val}</span>,
            sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'blue';
                let icon = <SyncOutlined spin />;
                if (status === 'FUNDED') { color = 'cyan'; icon = <ClockCircleOutlined />; }
                if (status === 'ACTIVE') { color = 'processing'; icon = <SyncOutlined spin />; }
                if (status === 'COMPLETED') { color = 'success'; icon = <CheckCircleOutlined />; }
                return <Tag icon={icon} color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (ts) => <span className="text-slate-400 text-xs">{new Date(ts).toLocaleString()}</span>,
            sorter: (a, b) => a.timestamp - b.timestamp,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: () => (
                <Button size="small" type="link">Chi tiết</Button>
            ),
        },
    ];

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Breadcrumb & Title */}
            <div className="mb-6">
                <Breadcrumb items={[
                    { title: <a onClick={() => router.push('/dashboard')}>Tổng quan</a> },
                    { title: 'Lịch sử giao dịch' }
                ]} />
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => router.push('/dashboard')}
                            className="border-none shadow-sm"
                        />
                        <Title level={2} className="!m-0">Lịch sử giao dịch</Title>
                    </div>
                    {loading && <Spin indicator={<SyncOutlined spin />} size="small" />}
                </div>
            </div>

            {/* Filters Section */}
            <Card className="mb-8 shadow-sm border-none rounded-xl">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <Input 
                        placeholder="Tìm kiếm theo mã ID, ví..." 
                        prefix={<SearchOutlined className="text-slate-400" />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        className="flex-1 h-10 rounded-lg"
                    />
                    
                    <Space wrap className="w-full md:w-auto">
                        <Select 
                            defaultValue="all" 
                            className="w-full md:w-32 h-10"
                            onChange={v => setFilterType(v as 'all' | 'buyer' | 'seller')}
                        >
                            <Select.Option value="all">Tất cả vai trò</Select.Option>
                            <Select.Option value="buyer">Người Mua</Select.Option>
                            <Select.Option value="seller">Người Bán</Select.Option>
                        </Select>

                        <Select 
                            defaultValue="all" 
                            className="w-full md:w-32 h-10"
                            onChange={v => setFilterStatus(v as 'all' | 'FUNDED' | 'ACTIVE' | 'COMPLETED')}
                        >
                            <Select.Option value="all">Tất cả trạng thái</Select.Option>
                            <Select.Option value="FUNDED">Đã Cọc</Select.Option>
                            <Select.Option value="ACTIVE">Đang Xử Lý</Select.Option>
                            <Select.Option value="COMPLETED">Hoàn Tất</Select.Option>
                        </Select>

                        <Button 
                            icon={<FilterOutlined />} 
                            className="h-10 px-6 rounded-lg font-semibold"
                            onClick={() => {
                                setSearchText('');
                                setFilterType('all');
                                setFilterStatus('all');
                            }}
                        >
                            Làm mới
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* Table Section */}
            <Card className="shadow-md border-none rounded-xl overflow-hidden p-0">
                <Table 
                    columns={columns} 
                    dataSource={filteredData} 
                    rowKey="fullId"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng cộng ${total} giao dịch`,
                        className: "px-6"
                    }}
                    locale={{
                        emptyText: <Empty description="Không tìm thấy giao dịch nào phù hợp." />
                    }}
                />
            </Card>
        </div>
    );
};

export default HistoryPage;