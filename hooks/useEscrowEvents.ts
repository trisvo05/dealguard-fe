import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSuiClient } from '@mysten/dapp-kit';

export interface Transaction {
    id: string;
    fullId: string;
    counterparty: string;
    amount: string;
    status: 'FUNDED' | 'ACTIVE' | 'COMPLETED';
    type: 'buyer' | 'seller';
    timestamp: number;
}

export interface LogMessage {
    id: string;
    time: string;
    content: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

const PACKAGE_ID = "0x085260c1fcb11036d90b859999b9d1b1b9785f2f5d07ea872f3fb543f7066022";

export const useEscrowEvents = (onNewIncomingEscrow?: (tx: Transaction) => void) => {
    const { address } = useAuth();
    const client = useSuiClient();
    const [transactions, setTransactions] = useState<{ asBuyer: Transaction[]; asSeller: Transaction[] }>({ asBuyer: [], asSeller: [] });
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const notifiedIds = useRef<Set<string>>(new Set());

    useEffect(() => {
        const fetchEvents = async () => {
            if (!address || !client) return;

            try {
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
                const newLogs: LogMessage[] = [];

                interface EscrowEventParsed {
                    escrow_id: string;
                    buyer: string;
                    seller: string;
                    amount: string;
                }

                events.data.forEach((e) => {
                    const parsed = e.parsedJson as EscrowEventParsed | undefined;
                    if (!parsed) return;

                    if (e.type.includes('::EscrowCreated')) {
                        const isBuyer = parsed.buyer === address;
                        const isSeller = parsed.seller === address;
                        
                        if (!isBuyer && !isSeller) return;

                        const escrowId = parsed.escrow_id;
                        const displayId = `${escrowId.slice(0, 6)}...${escrowId.slice(-4)}`;

                        const tx: Transaction = {
                            id:  displayId,
                            fullId: escrowId,
                            counterparty: isBuyer ? parsed.seller : parsed.buyer,
                            amount: (Number(parsed.amount) / 1_000_000_000).toLocaleString() + ' SUI',
                            status: 'FUNDED',
                            type: isBuyer ? 'buyer' : 'seller',
                            timestamp: Number(e.timestampMs)
                        };

                        if (isBuyer) newBuyerTxs.push(tx);
                        if (isSeller) {
                            newSellerTxs.push(tx);
                            if (!notifiedIds.current.has(escrowId)) {
                                if (onNewIncomingEscrow) onNewIncomingEscrow(tx);
                                notifiedIds.current.add(escrowId);
                            }
                        }

                        newLogs.push({
                            id: e.id.txDigest,
                            time: new Date(Number(e.timestampMs)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            content: isBuyer 
                                ? `Bạn đã tạo hợp đồng ${displayId} với số tiền ${tx.amount}`
                                : `Đối tác ${tx.counterparty.slice(0, 6)} đã tạo hợp đồng ${displayId} với bạn.`,
                            type: 'success'
                        });
                    }
                });

                const mockTransactions: { asBuyer: Transaction[]; asSeller: Transaction[] } = {
                    asBuyer: [
                        {
                            id: "0x824...f1e2",
                            fullId: "0x824483f78ecd4361a1ff798b3bf15de6f1e2abc3",
                            counterparty: "0x55da85df3dc04fe8a412c5668d876de11223344",
                            amount: "1.50 SUI",
                            status: "COMPLETED",
                            type: "buyer",
                            timestamp: Date.now() - 86400000 * 2 // 2 days ago
                        },
                        {
                            id: "0x081...4fae",
                            fullId: "0x081c474886b049b4b668faabf4965eb74fae7788",
                            counterparty: "0x2b30193e83b3c39211929cad0e1f2031aabbccdd",
                            amount: "10.00 SUI",
                            status: "ACTIVE",
                            type: "buyer",
                            timestamp: Date.now() - 3600000 * 5 // 5 hours ago
                        },
                        {
                            id: "0x1a2...f201",
                            fullId: "0x1a2f082d72a2b28100818b9cad0e1f201a2b3c4d",
                            counterparty: "0xf81d4fae7dec11d0a76500a0c91e6bf6f1e2a3b4",
                            amount: "0.50 SUI",
                            status: "FUNDED",
                            type: "buyer",
                            timestamp: Date.now() - 600000 // 10 mins ago
                        }
                    ],
                    asSeller: [
                        {
                            id: "0xbc2...9900",
                            fullId: "0xbc2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9900",
                            counterparty: "0x4192bff0e1e043ce44db912808c32493aabbcc21",
                            amount: "5.25 SUI",
                            status: "COMPLETED",
                            type: "seller",
                            timestamp: Date.now() - 86400000 * 5 // 5 days ago
                        },
                        {
                            id: "0xd92...3344",
                            fullId: "0xd9222d645c754940aaf5af622d1eb8efaa334455",
                            counterparty: "0xcdd71b404d62494aa8b738578c715dc45aa6677",
                            amount: "2.00 SUI",
                            status: "ACTIVE",
                            type: "seller",
                            timestamp: Date.now() - 86400000 // Yesterday
                        },
                        {
                            id: "0xe3d...1122",
                            fullId: "0xe3d82d5d6d3cbd3c3c4d5e6f7a8b9c0d11223344",
                            counterparty: "0x1a2f082d72a2b28100818b9cad0e1f2031aabbcc",
                            amount: "1.20 SUI",
                            status: "FUNDED",
                            type: "seller",
                            timestamp: Date.now() - 1800000 // 30 mins ago
                        }
                    ]
                };

                const combinedBuyer = [...newBuyerTxs, ...mockTransactions.asBuyer].sort((a, b) => b.timestamp - a.timestamp);
                const combinedSeller = [...newSellerTxs, ...mockTransactions.asSeller].sort((a, b) => b.timestamp - a.timestamp);

                setTransactions({ asBuyer: combinedBuyer, asSeller: combinedSeller });
                
                // Add mock logs as well
                const mockLogs: LogMessage[] = [
                    { id: 'm1', time: '10:05', content: 'Giao dịch 0x1a2...f201 đã được Buyer tạo thành công.', type: 'success' },
                    { id: 'm2', time: 'Yesterday', content: 'Bạn vừa nhận được yêu cầu 2.00 SUI từ đối tác 0xcdd...677.', type: 'info' }
                ];
                
                setLogs([...newLogs, ...mockLogs].slice(0, 20));
                setLoading(false);

            } catch (err) {
                console.error("Failed to fetch events:", err);
                setLoading(false);
            }
        };

        fetchEvents();
        const interval = setInterval(fetchEvents, 10000);
        return () => clearInterval(interval);
    }, [address, client, onNewIncomingEscrow]);

    return { transactions, logs, loading };
};
