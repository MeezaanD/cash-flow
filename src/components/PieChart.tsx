import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import "../styles/PieChart.css";

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartComponentProps {
  data: PieChartData[];
  onClose: () => void;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  onClose,
}) => {
  return (
    <div className="pie-chart-component">
      <div className="chart-container enhanced">
        <div className="chart-header">
          <div className="chart-title-group">
            <h2>Expense Breakdown</h2>
            <p className="chart-subtitle">
              Visualization of your spending categories
            </p>
          </div>
          <button onClick={onClose} className="close-button">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="var(--card-bg)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `R ${value.toFixed(2)}`,
                  "Amount",
                ]}
                contentStyle={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={10}
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "14px",
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-footer">
          <div className="color-legend">
            {data.map((item, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="legend-label">{item.name}</span>
                <span className="legend-value">R {item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;
