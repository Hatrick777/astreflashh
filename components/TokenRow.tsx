
import React from 'react';
import { Token } from '../types';

interface TokenRowProps {
  token: Token;
  onClick: (token: Token) => void;
}

const TokenRow: React.FC<TokenRowProps> = ({ token, onClick }) => {
  return (
    <button 
      onClick={() => onClick(token)}
      className="w-full flex items-center justify-between p-4 hover:bg-[#1a221d] transition-colors group text-left active:bg-[#232a26]"
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
          style={{ backgroundColor: token.color }}
        >
          {token.icon}
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">{token.name}</h3>
          <p className="text-gray-400 text-xs">{token.balance} {token.symbol}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-white font-semibold text-sm">${token.value}</p>
        <p className="text-green-400 text-xs font-medium">+{token.change}</p>
      </div>
    </button>
  );
};

export default TokenRow;
