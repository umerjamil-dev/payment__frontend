import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 16px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
            }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</p>
                <p style={{ fontSize: 20, fontWeight: 900, color: '#CA1D2A' }}>
                    ${Number(payload[0].value).toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export const RevenueChart = ({ data }) => {
    const safeData = Array.isArray(data) ? data : [];

    const hasData = safeData.some(d => d.revenue > 0);

    if (!hasData) {
        return (
            <div className="h-[300px] w-full mt-4 flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-red-300" />
                </div>
                <p className="text-sm font-semibold text-gray-400">No revenue data yet</p>
                <p className="text-xs text-gray-300">Mark invoices as Paid to see revenue trends</p>
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={safeData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#CA1D2A" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#CA1D2A" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                        width={55}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#CA1D2A"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        dot={{ fill: '#CA1D2A', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
