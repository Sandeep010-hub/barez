import { SalesData } from '../types/dashboard';

export function buildDataSummary(data: SalesData[]) {
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const uniqueProducts = new Set(data.map((item) => item.product)).size;
    const uniqueRegions = new Set(data.map((item) => item.region)).size;

    return {
        totalRevenue,
        uniqueProducts,
        uniqueRegions,
        dataCount: data.length,
    };
}

/**
 * Utility for Tailwind class merging
 */
export function cn(...inputs: (string | boolean | undefined | null | number)[]) {
    return inputs.filter(Boolean).join(' ');
}
