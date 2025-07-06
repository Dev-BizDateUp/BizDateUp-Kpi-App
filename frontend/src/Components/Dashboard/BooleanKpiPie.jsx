// components/BooleanKpiPieCharts.tsx
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const COLORS = ['#4CAF50', '#F44336']; // green for 1s, red for 0s

export default function BooleanKpiPie({ booleanKpis }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {booleanKpis.map(kpi => (
        <div key={kpi.id} className="text-center">
          <h2 className="text-lg font-semibold mb-2">{kpi.title}</h2>
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={kpi.pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {kpi.pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      ))}
    </div>
  );
}
