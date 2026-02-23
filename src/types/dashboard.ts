export interface SalesData {
    id: string;
    date: string;
    product: string;
    region: string;
    revenue: number;
    units_sold: number;
    category: string;
}

export interface KPIData {
    label: string;
    value: string | number;
    change: number;
    isPositive: boolean;
}

export interface InsightMessage {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    content: string;
    timestamp: string;
}
