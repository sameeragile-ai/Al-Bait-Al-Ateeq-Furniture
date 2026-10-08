import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#4A3426]/10 animate-pulse flex flex-col">
      <div className="aspect-[4/3] bg-[#EADECF]/50 w-full" />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-3 bg-[#EADECF]/60 rounded w-1/3" />
          <div className="h-5 bg-[#EADECF]/80 rounded w-4/5" />
          <div className="h-3 bg-[#EADECF]/50 rounded w-full" />
        </div>
        <div className="pt-4 mt-4 border-t border-[#4A3426]/5 flex items-center justify-between">
          <div className="h-5 bg-[#EADECF] rounded w-1/3" />
          <div className="h-9 bg-[#EADECF] rounded-lg w-24" />
        </div>
      </div>
    </div>
  );
};
