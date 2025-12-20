
export interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  value: string;
  change: string;
  changePercent: string;
  color: string;
  icon: string;
}

export interface MarketInsight {
  token: string;
  analysis: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}
