export interface StockAlert {
  productId: number;
  productName: string;
  currentStock: number;
  minStock: number;
  severity: 'LOW' | 'CRITICAL';
}
