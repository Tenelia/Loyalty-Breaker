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
  itemCount: number; // Total number of items in this solution
  uniqueItems: number; // Number of unique item types
}

export enum CalculationStatus {
  IDLE = 'IDLE',
  CALCULATING = 'CALCULATING',
  FOUND = 'FOUND',
  IMPOSSIBLE = 'IMPOSSIBLE'
}
