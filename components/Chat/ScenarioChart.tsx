import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Scenario } from '../../types';

interface ScenarioChartProps {
  scenario: Scenario;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const ScenarioChart: React.FC<ScenarioChartProps> = ({ scenario }) => {
  const data = scenario.allocations.map(a => ({
    name: a.fund.constituent_fund.replace('Manulife MPF', '').trim().substring(0, 15) + '...',
    value: a.allocation
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 my-4">
      <h4 className="text-sm font-bold text-gray-800 mb-2 border-b pb-2">{scenario.title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{fontSize: '10px'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs flex flex-col justify-center space-y-3">
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
             <span className="text-gray-500">Weighted FER</span>
             <span className="font-bold text-blue-600">{scenario.weightedFER?.toFixed(2)}%</span>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-gray-400 border-b text-[10px]">
                        <th className="pb-1 font-medium">Fund</th>
                        <th className="pb-1 text-right font-medium">Alloc</th>
                        <th className="pb-1 text-right font-medium">1Y</th>
                        <th className="pb-1 text-right font-medium hidden sm:table-cell">3Y</th>
                        <th className="pb-1 text-right font-medium hidden sm:table-cell">5Y</th>
                        <th className="pb-1 text-center font-medium">Risk</th>
                    </tr>
                </thead>
                <tbody>
                    {scenario.allocations.map((a, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0">
                            <td className="py-1.5 pr-1 truncate max-w-[80px] sm:max-w-[100px]" title={a.fund.constituent_fund}>
                                {a.fund.constituent_fund.split(' - ')[0]}
                            </td>
                            <td className="py-1.5 text-right font-semibold">{a.allocation}%</td>
                            <td className={`py-1.5 text-right ${a.fund.annualized_return_1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {a.fund.annualized_return_1y.toFixed(1)}%
                            </td>
                            <td className={`py-1.5 text-right hidden sm:table-cell ${a.fund.annualized_return_3y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {a.fund.annualized_return_3y.toFixed(1)}%
                            </td>
                             <td className={`py-1.5 text-right hidden sm:table-cell ${a.fund.annualized_return_5y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {a.fund.annualized_return_5y.toFixed(1)}%
                            </td>
                            <td className="py-1.5 text-center">
                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] 
                                    ${a.fund.risk_class <= 2 ? 'bg-green-100 text-green-800' : 
                                      a.fund.risk_class <= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                    {a.fund.risk_class}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioChart;