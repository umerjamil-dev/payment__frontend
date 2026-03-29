import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users } from 'lucide-react';

const BAR_COLORS = ['#CA1D2A', '#5B4FE9', '#10b981', '#f59e0b', '#3b82f6'];

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
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    {label}
                </p>
                <p style={{ fontSize: 18, fontWeight: 900, color: '#CA1D2A' }}>
                    ${Number(payload[0].value).toLocaleString()}
                </p>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Total Revenue</p>
            </div>
        );
    }
    return null;
};

export const TopClientsChart = ({ data }) => {
    const safeData = Array.isArray(data) ? data : [];
    const hasData = safeData.length > 0 && safeData.some(d => d.value > 0);

    if (!hasData) {
        return (
            <div className="h-[300px] w-full mt-4 flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-blue-300" />
                </div>
                <p className="text-sm font-semibold text-gray-400">No client revenue yet</p>
                <p className="text-xs text-gray-300">Paid invoices will show top clients here</p>
            </div>
        );
    }

    // Truncate long names for chart readability
    const chartData = safeData.map(d => ({
        ...d,
        shortName: d.name?.length > 14 ? d.name.slice(0, 13) + '…' : d.name,
        fullName: d.name,
    }));

    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                    />
                    <YAxis
                        dataKey="shortName"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                        width={110}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar
                        dataKey="value"
                        radius={[0, 8, 8, 0]}
                        barSize={22}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
