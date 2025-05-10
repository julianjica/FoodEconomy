import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InflationBarChart = ({ data, title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">{title || 'Inflación mensual'}</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Inflación']}
            />
            <Legend />
            <Bar 
              dataKey="inflation" 
              fill="#82ca9d" 
              name="Inflación" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InflationBarChart;