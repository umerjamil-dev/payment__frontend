import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart2 } from 'lucide-react';

const FALLBACK_COLORS = ['#CA1D2A', '#5B4FE9', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const item = payload[0];
        return (
            <div style={{
                background: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 16px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
            }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    {item.name}
                </p>
                <p style={{ fontSize: 18, fontWeight: 900, color: item.payload.color || '#5B4FE9' }}>
                    ${Number(item.value).toLocaleString()}
                </p>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Total Revenue</p>
            </div>
        );
    }
    return null;
};

export const BrandPerformanceChart = ({ data }) => {
    const safeData = Array.isArray(data) ? data : [];
    const hasData = safeData.some(d => d.value > 0);

    if (!hasData) {
        return (
            <div className="h-[300px] w-full mt-4 flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                    <BarChart2 className="w-7 h-7 text-indigo-300" />
                </div>
                <p className="text-sm font-semibold text-gray-400">No brand data yet</p>
                <p className="text-xs text-gray-300">Add brands and create paid invoices to track performance</p>
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={safeData}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        strokeWidth={0}
                    >
                        {safeData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => (
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
