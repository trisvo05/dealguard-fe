"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Avatar } from 'antd';
import { MessageOutlined, CloseOutlined, RobotOutlined, CheckCircleFilled } from '@ant-design/icons';

export interface LogMessage {
  id: string;
  time: string;
  content: string;
  type: 'info' | 'success';
}

interface ActivityLogBubbleProps {
  logs: LogMessage[];
}

export function ActivityLogBubble({ logs }: ActivityLogBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  // Auto-open when new log arrives (optional wow factor)
  useEffect(() => {
    if (logs.length > 0 && !isOpen) {
        // Optional: setIsOpen(true); to auto-pop
    }
  }, [logs.length, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Chat Window */}
      {isOpen && (
        <Card 
          className="w-80 md:w-96 shadow-2xl border-none rounded-3xl overflow-hidden animate-slide-up bg-white/95 backdrop-blur-sm"
          styles={{ body: { padding: 0 } }}
            title={
            <div className="flex items-center gap-2 text-[#003366]">
              <RobotOutlined /> 
              <span>Nhật Ký Giao Dịch</span>
              <span className="ml-auto text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                Trực tiếp
              </span>
            </div>
          }
          extra={
            <Button 
                type="text" 
                icon={<CloseOutlined />} 
                onClick={() => setIsOpen(false)} 
                size="small"
                className="rounded-full hover:bg-slate-100"
            />
          }
        >
          <div 
            ref={scrollRef}
            className="h-80 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50"
          >
            {logs.length === 0 && (
                <div className="text-center text-gray-400 mt-10 text-xs">
                    Chưa có hoạt động nào...
                </div>
            )}
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 animate-fade-in">
                <Avatar 
                    size="small" 
                    icon={<RobotOutlined />} 
                    className={log.type === 'success' ? 'bg-green-500' : 'bg-blue-500'} 
                />
                <div className="flex flex-col max-w-[85%]">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-sm text-gray-700">
                        {log.content}
                        {log.type === 'success' && (
                            <div className="mt-1 text-green-600 font-bold flex items-center gap-1 text-[10px] uppercase">
                                <CheckCircleFilled /> Đã xác thực On-chain
                            </div>
                        )}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 ml-1">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t bg-gray-50 text-center text-xs text-gray-400 italic">
             Chỉ xem • Được mã hoá trên Blockchain
          </div>
        </Card>
      )}

      {/* Floating Action Button */}
      <Button
        type="primary"
        size="large"
        icon={<MessageOutlined style={{ fontSize: '24px' }} />}
        className="shadow-lg hover:scale-110 transition-transform bg-[#003366] flex items-center justify-center relative"
        style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            minWidth: '60px',
            padding: 0
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {logs.length > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] items-center justify-center font-bold">
                    {logs.length}
                </span>
            </span>
        )}
      </Button>
    </div>
  );
}
