import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const TopClientsChart = ({ data }) => {
    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" hide />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                        width={100}
                    />
                    <Tooltip
                        cursor={{ fill: '#F8FAFC' }}
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            background: '#fff'
                        }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar 
                        dataKey="value" 
                        radius={[0, 8, 8, 0]} 
                        barSize={24}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#5B4FE9" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
