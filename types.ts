
export interface HealthAnalysis {
  productName: string;
  healthScore: number; // 0 to 100
  verdict: 'Excellent' | 'Bon' | 'Médiocre' | 'Mauvais';
  calories: string;
  nutrients: {
    label: string;
    value: string;
    impact: 'positive' | 'neutral' | 'negative';
  }[];
  pros: string[];
  cons: string[];
  additives: string[];
  recommendation: string;
  alternatives: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
