import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChartComponentProps } from '../types';
import DateRangeFilter, { DateRange } from './DateRangeFilter';
import { Button } from './ui/button';
import { X } from 'lucide-react';

const PieChartComponent: React.FC<PieChartComponentProps> = ({
	data,
	onClose,
	dateRange,
	onDateRangeChange,
}) => {
	const handleDateRangeChange = (newRange: DateRange) => {
		if (onDateRangeChange) {
			onDateRangeChange(newRange);
		}
	};

	const handleClearDateRange = () => {
		if (onDateRangeChange) {
			onDateRangeChange({ startDate: '', endDate: '' });
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-4xl rounded-lg border bg-card p-6 shadow-lg">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-semibold">Expense Breakdown</h2>
						<p className="text-sm text-muted-foreground">
							Visualization of your spending categories
						</p>
					</div>
					<Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chart">
						<X className="h-5 w-5" />
					</Button>
				</div>

				{onDateRangeChange && (
					<div className="mb-6">
						<DateRangeFilter
							dateRange={dateRange || { startDate: '', endDate: '' }}
							onDateRangeChange={handleDateRangeChange}
							onClear={handleClearDateRange}
						/>
					</div>
				)}

				<div className="mb-6">
					<ResponsiveContainer width="100%" height={300}>
						<RechartsPieChart>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={90}
								paddingAngle={2}
								dataKey="value"
								label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
								labelLine={false}
							>
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={entry.color}
										stroke="hsl(var(--card))"
										strokeWidth={2}
									/>
								))}
							</Pie>
							<Tooltip
								formatter={(value: number) => [`R ${value.toFixed(2)}`, 'Amount']}
								contentStyle={{
									background: 'hsl(var(--card))',
									border: '1px solid hsl(var(--border))',
									borderRadius: '8px',
									boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
									color: 'hsl(var(--foreground))',
								}}
								labelStyle={{
									color: 'hsl(var(--foreground))',
								}}
								itemStyle={{
									color: 'hsl(var(--foreground))',
								}}
							/>
						</RechartsPieChart>
					</ResponsiveContainer>
				</div>

				<div className="space-y-2">
					{data.map((item, index) => (
						<div key={index} className="flex items-center justify-between rounded-lg border p-3">
							<div className="flex items-center gap-3">
								<div
									className="h-4 w-4 rounded-full"
									style={{ backgroundColor: item.color }}
								/>
								<span className="font-medium">{item.name}</span>
							</div>
							<span className="font-semibold">R {item.value.toFixed(2)}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PieChartComponent;
