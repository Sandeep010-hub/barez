'use client';

import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { SalesData } from '../types/dashboard';
import { DollarSign, Package, TrendingUp, MapPin, Database } from 'lucide-react';

interface DashboardProps {
    data: SalesData[];
}

const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const stats = useMemo(() => {
        if (data.length === 0) return null;

        const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
        const totalUnits = data.reduce((sum, item) => sum + item.units_sold, 0);

        const productSales: Record<string, number> = {};
        const regionSales: Record<string, number> = {};
        const monthlySales: Record<string, number> = {};

        data.forEach(item => {
            productSales[item.product] = (productSales[item.product] || 0) + item.revenue;
            regionSales[item.region] = (regionSales[item.region] || 0) + item.revenue;

            const month = item.date.substring(0, 7); // YYYY-MM
            monthlySales[month] = (monthlySales[month] || 0) + item.revenue;
        });

        const bestProduct = Object.entries(productSales).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        const bestRegion = Object.entries(regionSales).reduce((a, b) => a[1] > b[1] ? a : b)[0];

        const barData = Object.entries(productSales)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        const lineData = Object.entries(monthlySales)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => a.name.localeCompare(b.name));

        const pieData = Object.entries(regionSales)
            .map(([name, value]) => ({ name, value }));

        return {
            totalRevenue,
            totalUnits,
            bestProduct,
            bestRegion,
            barData,
            lineData,
            pieData
        };
    }, [data]);

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-card rounded-xl border border-dashed border-border text-center space-y-4">
                <Database className="w-12 h-12 text-muted-foreground opacity-20" />
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">No data loaded</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                        Please click &quot;Load Sample Data&quot; to activate the visualization layer.
                    </p>
                </div>
            </div>
        );
    }

    const kpis = [
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'border-l-blue-500' },
        { label: 'Total Units Sold', value: `${stats.totalUnits.toLocaleString()} units`, icon: Package, color: 'border-l-green-500' },
        { label: 'Best Product', value: stats.bestProduct, icon: TrendingUp, color: 'border-l-purple-500' },
        { label: 'Best Region', value: stats.bestRegion, icon: MapPin, color: 'border-l-orange-500' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                    <div key={kpi.label} className={`bg-card p-6 rounded-xl border border-border border-l-4 ${kpi.color} shadow-sm flex flex-col gap-1 transition-all hover:shadow-md`}>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
                            <kpi.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="mt-1">
                            <span className="text-2xl font-bold tracking-tight">{kpi.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart: Revenue by Product */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Revenue by Product
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.barData} layout="vertical" margin={{ left: 40, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    width={100}
                                />
                                <Tooltip
                                    formatter={(value: number | undefined) => [value !== undefined ? `$${(value / 1000).toFixed(0)}k` : '$0k', 'Revenue']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#0f172a" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line Chart: Monthly Trend */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Monthly Revenue Trend
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    tickFormatter={(val) => `$${val / 1000}k`}
                                />
                                <Tooltip
                                    formatter={(value: number | undefined) => [value !== undefined ? `$${value.toLocaleString()}` : '$0', 'Revenue']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#0f172a"
                                    strokeWidth={3}
                                    dot={{ r: 6, fill: '#0f172a', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Revenue by Region */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Revenue by Region
                    </h3>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={140}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number | undefined) => value !== undefined ? `$${value.toLocaleString()}` : '$0'}
                                />
                                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
