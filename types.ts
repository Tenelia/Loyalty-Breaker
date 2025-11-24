export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface Solution {
  topUpsNeeded: number;
  finalTargetBalance: number;
  items: MenuItem[];
  totalCost: number;
}

export enum CalculationStatus {
  IDLE = 'IDLE',
  CALCULATING = 'CALCULATING',
  FOUND = 'FOUND',
  IMPOSSIBLE = 'IMPOSSIBLE',
  ERROR = 'ERROR'
}
