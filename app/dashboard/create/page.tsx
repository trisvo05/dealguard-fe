'use client';

import React, { useState } from 'react';
import { 
    Card, 
    Form, 
    Input, 
    Button, 
    Radio, 
    InputNumber, 
    Steps, 
    Divider, 
    Typography,
    Alert,
    message
} from 'antd';
import { 
    UserOutlined, 
    WalletOutlined, 
    DollarOutlined, 
    RocketOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useCurrentAccount, useSignAndExecuteTransaction, ConnectButton } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { isValidSuiAddress } from '@mysten/sui/utils';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CreateEscrowFormValues {
    role: 'buyer' | 'seller';
    counterpartyAddress: string;
    amount: number;
    duration: number;
    description: string;
}

export default function CreateEscrowPage() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [role, setRole] = useState('buyer'); // 'buyer' | 'seller'
    const [loading, setLoading] = useState(false);
    const account = useCurrentAccount();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

    const onFinish = (values: CreateEscrowFormValues) => {
        if (!account) {
            message.error('Vui lòng kết nối ví trước!');
            return;
        }

        setLoading(true);
        console.log('Success:', values);

        const tx = new Transaction();
        const PACKAGE_ID = "0x085260c1fcb11036d90b859999b9d1b1b9785f2f5d07ea872f3fb543f7066022";
        const MODULE = "escrow";
        const FUNCTION = "create_escrow";

        // 1. Prepare Coin Input (Split generic gas coin)
        // Amount inputs are usually in natural units (e.g. 10 USDC), need decimals. 
        // Assuming SUI for simplicity for now (9 decimals).
        // If USDC, need that specific coin. The contract uses Coin<SUI> based on source.
        // Let's assume SUI for this MVP.
        const amountInMist = BigInt(values.amount) * BigInt(1_000_000_000); 

        const [paymentCoin] = tx.splitCoins(tx.gas, [amountInMist]);

        // 2. Fix Description type - Move expects vector<u8> -> string in PTB defaults to string
        // Actually for vector<u8>, we pass string and it works, or tx.pure.string().
        
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::${FUNCTION}`,
            arguments: [
                tx.pure.address(values.counterpartyAddress),
                paymentCoin,
                tx.pure.string(values.description),
            ],
        });

        // 3. Execute
        signAndExecuteTransaction(
            {
                transaction: tx,
            },
            {
                onSuccess: (result) => {
                    console.log('Transaction Result:', result);
                    message.success('Tạo Escrow thành công! Transaction Hash: ' + result.digest);
                    setLoading(false);
                    router.push('/dashboard');
                },
                onError: (error) => {
                    console.error('Transaction Failed:', error);
                    message.error('Giao dịch thất bại: ' + error.message);
                    setLoading(false);
                },
            }
        );
    };

    return (
        <div className="max-w-4xl mx-auto pt-6">
            {/* Header */}
            <div className="mb-8 text-center md:text-left">
                <Title level={2} style={{ color: '#003366', margin: 0 }}>
                    <RocketOutlined className="mr-3" />
                    Tạo Hợp đồng mới
                </Title>
                <Text type="secondary">
                    Thiết lập giao dịch an toàn thông qua Smart Contract.
                </Text>
            </div>

            {!account ? (
                 <Alert
                    title="Kết nối ví"
                    description="Bạn cần kết nối ví ZkLogin / Sui Wallet để thực hiện giao dịch này."
                    type="warning"
                    showIcon
                    action={
                        <ConnectButton />
                    }
                    className="mb-6 shadow-sm border-amber-200"
                />
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                {/* LEFT: FORM INPUT */}
                <div className="md:col-span-2">
                    <Card 
                        className="shadow-md rounded-xl border-none"
                        title="Thông tin giao dịch"
                        styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{ role: 'buyer', currency: 'USDC' }}
                            requiredMark="optional"
                            disabled={!account}
                        >
                            {/* 1. ROLE SELECTION */}
                            <Form.Item 
                                label={<span className="font-semibold text-gray-700">Vai trò của bạn</span>} 
                                name="role"
                            >
                                <Radio.Group 
                                    onChange={(e) => setRole(e.target.value)} 
                                    className="w-full flex gap-4"
                                    style={{ display: 'flex' }} // Force display flex to override any AntD styles
                                >
                                    {/* Buyer Option */}
                                    <label className={`
                                        flex-1 cursor-pointer relative flex flex-row items-center p-4 rounded-xl border-2 transition-all duration-300 h-full
                                        ${role === 'buyer' 
                                            ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' 
                                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                        }
                                    `}>
                                        <div className={`p-3 rounded-full mr-4 shrink-0 ${role === 'buyer' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <WalletOutlined style={{ fontSize: '24px' }} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`font-bold text-base ${role === 'buyer' ? 'text-blue-700' : 'text-gray-600'}`}>
                                                Tôi là Người Mua
                                            </span>
                                            <span className="text-xs text-gray-400 mt-0.5">
                                                Tôi muốn mua hàng/dịch vụ và sẽ nạp tiền.
                                            </span>
                                        </div>
                                        <Radio value="buyer" className="ml-auto" />
                                    </label>

                                    {/* Seller Option */}
                                    <label className={`
                                        flex-1 cursor-pointer relative flex flex-row items-center p-4 rounded-xl border-2 transition-all duration-300 h-full
                                        ${role === 'seller' 
                                            ? 'border-green-500 bg-green-50 shadow-md scale-[1.02]' 
                                            : 'border-slate-200 hover:border-green-300 hover:bg-slate-50'
                                        }
                                    `}>
                                        <div className={`p-3 rounded-full mr-4 shrink-0 ${role === 'seller' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <UserOutlined style={{ fontSize: '24px' }} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`font-bold text-base ${role === 'seller' ? 'text-green-700' : 'text-gray-600'}`}>
                                                Tôi là Người Bán
                                            </span>
                                            <span className="text-xs text-gray-400 mt-0.5">
                                                Tôi cung cấp hàng/dịch vụ và nhận tiền.
                                            </span>
                                        </div>
                                        <Radio value="seller" className="ml-auto" />
                                    </label>
                                </Radio.Group>
                            </Form.Item>

                            <Divider dashed />

                            {/* 2. COUNTERPARTY INFO */}
                            <Form.Item
                                label={<span className="font-semibold text-gray-700">{role === 'buyer' ? 'Địa chỉ ví Người Bán (Seller)' : 'Địa chỉ ví Người Mua (Buyer)'}</span>}
                                name="counterpartyAddress"
                                hasFeedback
                                rules={[
                                    { required: true, message: 'Vui lòng nhập địa chỉ ví đối tác!' },
                                    {
                                        validator: (_, value) => {
                                            if (!value || isValidSuiAddress(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Địa chỉ ví Sui không hợp lệ!'));
                                        }
                                    }
                                ]}
                                tooltip="Địa chỉ ví Sui của đối tác giao dịch."
                            >
                                <Input 
                                    prefix={<UserOutlined className="text-gray-400" />} 
                                    placeholder="0x..." 
                                    size="large"
                                    className="font-mono text-sm"
                                />
                            </Form.Item>

                            {/* 3. DEAL DETAILS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item
                                    label={<span className="font-semibold text-gray-700">Số tiền (SUI)</span>}
                                    name="amount"
                                    rules={[{ required: true, message: 'Nhập số tiền!' }]}
                                >
                                    <InputNumber<number>
                                        prefix={<DollarOutlined className="text-gray-400" />}
                                        style={{ width: '100%' }}
                                        size="large"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value ? parseFloat(value.replace(/\$\s?|(,*)/g, '')) : 0} 
                                        placeholder="1,000"
                                        min={0.1}
                                        step={0.1}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-semibold text-gray-700">Thời hạn (Ngày)</span>}
                                    name="duration"
                                    initialValue={3}
                                >
                                     <InputNumber
                                        style={{ width: '100%' }}
                                        size="large"
                                        min={1}
                                        max={30}
                                        suffix="Ngày"
                                    />
                                </Form.Item>
                            </div>

                        <Form.Item
                            label={<span className="font-semibold text-gray-700">Mô tả / Điều khoản</span>}
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả giao dịch!' }]}
                        >
                            <TextArea 
                                rows={4} 
                                placeholder="Ví dụ: Thanh toán cho lô hàng linh kiện điện tử mã #batch991. Điều kiện mở khoá: Khi hàng đến cảng Hải Phòng..." 
                                showCount 
                                maxLength={500} 
                            />
                        </Form.Item>

                        {/* SUBMIT */}
                        <Form.Item className="mt-8 mb-0">
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                size="large" 
                                block
                                loading={loading}
                                className="h-12 text-lg font-bold bg-[#003366] hover:bg-[#002244]"
                            >
                                Tạo Hợp đồng (On-chain)
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>

            {/* RIGHT: PREVIEW & GUIDE */}
            <div className="md:col-span-1 flex flex-col gap-6">
                 <Card className="bg-blue-50 border-blue-100 shadow-sm rounded-xl">
                    <Title level={5} className="!text-[#003366] mb-4">Quy trình xử lý</Title>
                    <Steps
                        orientation="vertical" // Updated from direction (AntD v6)
                        size="small"
                        current={0}
                        className="deal-process-steps"
                        items={[
                            { title: 'Tạo yêu cầu', content: 'Bạn điền thông tin và ký xác nhận.' },
                            { title: 'Chờ đối tác duyệt', content: 'Gửi link cho đối tác để họ tham gia (Join).' },
                            { title: 'Đặt cọc (Fund)', content: 'Buyer gửi tiền vào Smart Contract.' },
                            { title: 'Hoàn tất', content: 'Tiền được giải ngân an toàn.' },
                        ]}
                    />
                 </Card>

                 <Alert
                    title="Lưu ý quan trọng" // Updated from message
                    description="Hợp đồng sau khi tạo sẽ chưa có hiệu lực cho đến khi đối tác Xác nhận và Buyer nạp tiền cọc."
                    type="info"
                    showIcon
                    className="rounded-xl border-blue-200 bg-blue-50"
                 />
            </div>
            </div>
        </div>
    );
}
