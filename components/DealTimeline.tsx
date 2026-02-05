"use client";

import React from 'react';
import { Check, Loader2 } from 'lucide-react';

interface DealTimelineProps {
  currentStep: number; // 0 to 3
}

const STEPS = [
  { id: 0, title: 'Đặt cọc', description: 'Buyer deposits funds' },
  { id: 1, title: 'Đang vận chuyển', description: 'Seller ships goods' },
  { id: 2, title: 'Đã nhận hàng', description: 'Buyer verifies goods' },
  { id: 3, title: 'Hoàn tất', description: 'Funds released to Seller' },
];

export function DealTimeline({ currentStep }: DealTimelineProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10"></div>
        
        {/* Active Progress Bar */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 rounded-full -z-10 transition-all duration-700 ease-in-out"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        ></div>

        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          // const isFuture = index > currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative group">
              {/* Node Circle */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 bg-white
                  ${isCompleted ? 'border-green-500 bg-green-50 text-green-600 shadow-[0_0_0_4px_rgba(34,197,94,0.2)]' : ''}
                  ${isActive ? 'border-yellow-500 text-yellow-600 scale-110 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : ''}
                  ${!isCompleted && !isActive ? 'border-gray-300 text-gray-400' : ''}
                `}
              >
                {isCompleted && <Check className="w-6 h-6 animate-in zoom-in duration-300" />}
                {isActive && <Loader2 className="w-6 h-6 animate-spin" />}
                {!isCompleted && !isActive && <div className="w-3 h-3 bg-gray-300 rounded-full" />}
              </div>

              {/* Text Info */}
              <div className="absolute top-12 flex flex-col items-center w-32 text-center">
                <span className={`text-xs font-bold transition-colors duration-300 
                  ${isCompleted ? 'text-green-700' : ''}
                  ${isActive ? 'text-yellow-700' : ''}
                  ${!isCompleted && !isActive ? 'text-gray-400' : ''}
                `}>
                  {step.title}
                </span>
                <span className="text-[10px] text-gray-500 hidden group-hover:block transition-opacity duration-200 mt-1">
                    {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
