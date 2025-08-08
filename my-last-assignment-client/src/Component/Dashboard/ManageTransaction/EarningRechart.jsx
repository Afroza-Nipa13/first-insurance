import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { aggregatePaymentsByDate } from '../../../utils/aggregateByDates';

const EarningRechart = ({payments}) => {
    const chartData = aggregatePaymentsByDate(payments);
    return (
        <div className="bg-white p-6 rounded-xl shadow mb-8">
      <h3 className="text-xl font-bold mb-4">📈 Earnings Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEarning" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f86969" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#4f46e5"
            fillOpacity={1}
            fill="url(#colorEarning)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    );
};

export default EarningRechart;