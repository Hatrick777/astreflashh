
import React, { useState, useRef, useEffect } from 'react';
import { 
  Clock,
  Search,
  ChevronRight,
  Home,
  Wallet,
  ArrowLeftRight,
  MessageSquare,
  BadgeCheck,
  Loader2
} from 'lucide-react';
import { Token } from './types.ts';

const TOKENS: Token[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: '1.00',
    value: '88,218.10',
    change: '-1,023.31',
    changePercent: '-1.15%',
    color: '#f7931a',
    icon: 'B'
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '2.00',
    value: '5,956.94',
    change: '-157.02',
    changePercent: '-2.57%',
    color: '#1c1c1c',
    icon: 'Ξ'
  }
];

const ActionButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="flex flex-col items-center justify-center flex-1 h-[88px] rounded-[28px] bg-[#1c1c1c] hover:bg-[#252525] active:scale-[0.96] transition-all">
    <div className="text-[#B5A1FF] mb-1.5 flex items-center justify-center">
      {icon}
    </div>
    <span className="text-[#999999] text-[13px] font-semibold tracking-tight">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow pull to refresh if we are at the top
    if (window.scrollY <= 0) {
      startY.current = e.touches[0].pageY;
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || isRefreshing) return;
    
    const currentY = e.touches[0].pageY;
    const diff = currentY - startY.current;

    if (diff > 0) {
      // iPhone-style rubber banding (logarithmic resistance)
      // Safety check for Math.pow with potential negative diff (though checked by if)
      const easedDiff = Math.pow(Math.max(0, diff), 0.8) * 1.5;
      setPullDistance(easedDiff);
      
      // Stop browser default pull-to-refresh if we are handling it
      if (diff > 5 && e.cancelable) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (pullDistance > 80) {
      triggerRefresh();
    } else {
      setPullDistance(0);
    }
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setPullDistance(60);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (e) {
        // Vibrate might fail in some contexts
      }
    }

    setTimeout(() => {
      setIsRefreshing(false);
      setPullDistance(0);
    }, 1500);
  };

  const rotation = Math.min(pullDistance * 4, 360);
  const opacity = Math.min(pullDistance / 60, 1);
  const scale = Math.min(pullDistance / 80, 1);

  return (
    <div 
      className="min-h-screen w-full bg-[#000000] text-white flex flex-col max-w-md mx-auto relative overflow-x-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Pull-to-Refresh Indicator (iPhone style) */}
      <div 
        className="absolute left-0 right-0 flex items-center justify-center pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{ 
          top: 0,
          height: isRefreshing ? '60px' : `${pullDistance}px`,
          opacity: opacity,
          transform: `translateY(${isRefreshing ? 0 : -20 + scale * 20}px)`
        }}
      >
        <div 
          className="bg-[#1c1c1c]/80 backdrop-blur-md p-2.5 rounded-full border border-white/10 shadow-2xl"
          style={{ transform: `scale(${scale})` }}
        >
          {isRefreshing ? (
            <Loader2 className="w-6 h-6 text-[#B5A1FF] animate-spin" strokeWidth={3} />
          ) : (
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-[#B5A1FF]"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <polyline points="21 3 21 8 16 8" />
            </svg>
          )}
        </div>
      </div>

      {/* Main Content Scrollable Area */}
      <div 
        className="flex-1 flex flex-col transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${isRefreshing ? 60 : pullDistance}px)` }}
      >
        {/* Header */}
        <header className="px-5 py-5 mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-full bg-[#ffb041] flex items-center justify-center relative overflow-hidden border border-white/5">
               <img 
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=ffb041" 
                alt="Avatar" 
                className="w-10 h-10 translate-y-1"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-[#777777] font-semibold uppercase tracking-widest leading-none mb-1">ASTRE FLASHER</span>
              <span className="text-[22px] font-semibold tracking-tighter leading-none">ASTRE</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-white/90">
            <Clock size={24} strokeWidth={1.5} className="cursor-pointer" />
            <Search size={24} strokeWidth={1.5} className="cursor-pointer" />
          </div>
        </header>

        {/* Balance Section */}
        <section className="px-5 pt-8 pb-8">
          <h1 className="text-[56px] font-semibold tracking-tighter leading-none mb-3">$95,740.68</h1>
          <div className="flex items-center gap-2">
            <span className="text-[#f14848] text-[20px] font-semibold tracking-tight">$-1,196.32</span>
            <span className="bg-[#f14848]/15 text-[#f14848] px-2.5 py-0.5 rounded-lg text-sm font-semibold">-1.25%</span>
          </div>
        </section>

        {/* Action Buttons (Strict Match to Reference) */}
        <section className="px-5 flex gap-3 mb-10">
          <ActionButton 
            label="Receive" 
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3.5" y="3.5" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2.8"/>
                <rect x="5.8" y="5.8" width="2.4" height="2.4" rx="0.5" fill="currentColor"/>
                <rect x="13.5" y="3.5" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2.8"/>
                <rect x="15.8" y="5.8" width="2.4" height="2.4" rx="0.5" fill="currentColor"/>
                <rect x="3.5" y="13.5" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2.8"/>
                <rect x="5.8" y="15.8" width="2.4" height="2.4" rx="0.5" fill="currentColor"/>
                <rect x="14" y="14" width="2.4" height="2.4" rx="0.5" fill="currentColor"/>
                <rect x="18" y="14" width="2.4" height="2.4" rx="0.5" fill="currentColor"/>
                <rect x="14" y="18" width="2.4" height="2.4" rx="0.5" fill="currentColor"/>
                <path d="M18.5 18.5H19.5V19.5H18.5V18.5Z" fill="currentColor"/>
                <path d="M20 20H21V21H20V20Z" fill="currentColor"/>
              </svg>
            } 
          />
          <ActionButton 
            label="Send" 
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 3L10 14" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 3L14.5 21L10 14L3 9.5L21 3Z" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            } 
          />
          <ActionButton 
            label="Swap" 
            icon={
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4L20 8L16 12" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 8H9C6.23858 8 4 10.2386 4 13" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 20L4 16L8 12" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 16H15C17.7614 16 20 13.7614 20 11" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            } 
          />
          <ActionButton 
            label="Buy" 
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V22" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 5H9.5C7.567 5 6 6.567 6 8.5C6 10.433 7.567 12 9.5 12H14.5C16.433 12 18 13.567 18 15.5C18 17.433 16.433 19 14.5 19H7" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            } 
          />
        </section>

        {/* Perps Section */}
        <section className="px-5 mb-10">
          <h2 className="text-[18px] font-semibold flex items-center gap-1 mb-4">Perps <ChevronRight size={18} className="text-[#666666] mt-0.5" /></h2>
          <div className="bg-[#1c1c1c] rounded-[24px] p-5 flex items-center gap-4 cursor-pointer hover:bg-[#252525] transition-colors">
            <div className="w-11 h-11 flex items-center justify-center shrink-0">
               <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
                  <path d="M12 28C12 28 14 20 22 20C30 20 32 28 32 28" stroke="#14F195" strokeWidth="3.5" strokeLinecap="round"/>
                  <path d="M12 16C12 16 14 24 22 24C30 24 32 16 32 16" stroke="#f7931a" strokeWidth="3.5" strokeLinecap="round"/>
                  <circle cx="22" cy="22" r="19" stroke="white" strokeOpacity="0.08" strokeWidth="1"/>
               </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[17px] tracking-tight">More Power with Perps</h3>
              <p className="text-[#777777] text-xs font-semibold">Trade with up to 40x leverage</p>
            </div>
          </div>
        </section>

        {/* Tokens Section */}
        <section className="px-5 pb-32">
          <h2 className="text-[18px] font-semibold flex items-center gap-1 mb-4">Tokens <ChevronRight size={18} className="text-[#666666] mt-0.5" /></h2>
          <div className="flex flex-col gap-3.5">
            {TOKENS.map((token) => (
              <div 
                key={token.id} 
                className="bg-[#1c1c1c] rounded-[24px] p-4 flex items-center justify-between hover:bg-[#252525] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className={`w-[44px] h-[44px] rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden ${token.id === 'btc' ? 'bg-[#f7931a]' : 'bg-[#1c1c1c] border border-white/10'}`}
                  >
                    {token.id === 'btc' ? 'B' : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L11.8 2.6V15.2L12 15.4L18.2 11.7L12 2Z" fill="white" fillOpacity="0.8"/>
                        <path d="M12 2L5.8 11.7L12 15.4V2Z" fill="white" fillOpacity="0.4"/>
                        <path d="M12 16.6L11.9 16.7V21.8L12 22L18.2 13.1L12 16.6Z" fill="white" fillOpacity="0.8"/>
                        <path d="M12 22V16.6L5.8 13.1L12 22Z" fill="white" fillOpacity="0.4"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-[16px] tracking-tight">{token.name}</h4>
                      <div className="w-[16px] h-[16px] bg-[#B5A1FF] rounded-[4px] flex items-center justify-center">
                        <BadgeCheck size={11} className="text-[#1c1c1c] fill-[#1c1c1c]" strokeWidth={3} />
                      </div>
                    </div>
                    <p className="text-[#777777] text-[13px] font-semibold">{token.balance} {token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[16px] tracking-tight">${token.value}</p>
                  <p className="text-[#f14848] text-[13px] font-semibold">{token.change}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Persistent Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/60 backdrop-blur-[32px] border-t border-white/5 px-8 py-5 flex items-center justify-between z-[60]">
        <button className="text-[#ff4dad] relative transition-transform active:scale-90">
          <Home size={28} strokeWidth={2.5} />
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#ff4dad] rounded-full shadow-[0_0_10px_rgba(255,77,173,0.8)]" />
        </button>
        <button className="text-[#333333] hover:text-[#777777] transition-colors active:scale-90">
          <Wallet size={28} strokeWidth={2.5} />
        </button>
        <button className="text-[#333333] hover:text-[#777777] transition-colors active:scale-90">
          <ArrowLeftRight size={28} strokeWidth={2.5} />
        </button>
        <button className="text-[#333333] hover:text-[#777777] transition-colors active:scale-90">
          <MessageSquare size={28} strokeWidth={2.5} />
        </button>
        <button className="text-[#333333] hover:text-[#777777] transition-colors active:scale-90">
          <Search size={28} strokeWidth={2.5} />
        </button>
      </nav>
    </div>
  );
};

export default App;
