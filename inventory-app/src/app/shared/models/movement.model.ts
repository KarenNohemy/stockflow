export interface Movement {
  id: number;
  productId: number;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  timestamp: string;
}
