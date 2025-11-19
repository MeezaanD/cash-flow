import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';

export interface DateRange {
	startDate: string;
	endDate: string;
}

interface DateRangeFilterProps {
	dateRange: DateRange;
	onDateRangeChange: (range: DateRange) => void;
	onClear: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
	dateRange,
	onDateRangeChange,
	onClear,
}) => {
	const [isCustomRange, setIsCustomRange] = useState(false);

	const presetRanges = [
		{ label: 'Last 7 days', value: '7days' },
		{ label: 'Last 30 days', value: '30days' },
		{ label: 'Last 3 months', value: '3months' },
		{ label: 'Last 6 months', value: '6months' },
		{ label: 'This year', value: 'thisYear' },
		{ label: 'Custom range', value: 'custom' },
	];

	const getPresetDates = (preset: string): DateRange => {
		const today = new Date();
		const startDate = new Date();

		switch (preset) {
			case '7days':
				startDate.setDate(today.getDate() - 7);
				break;
			case '30days':
				startDate.setDate(today.getDate() - 30);
				break;
			case '3months':
				startDate.setMonth(today.getMonth() - 3);
				break;
			case '6months':
				startDate.setMonth(today.getMonth() - 6);
				break;
			case 'thisYear':
				startDate.setMonth(0, 1);
				break;
			default:
				return dateRange;
		}

		return {
			startDate: startDate.toISOString().split('T')[0],
			endDate: today.toISOString().split('T')[0],
		};
	};

	const handlePresetChange = (preset: string) => {
		if (preset === 'custom') {
			setIsCustomRange(true);
		} else {
			setIsCustomRange(false);
			const newRange = getPresetDates(preset);
			onDateRangeChange(newRange);
		}
	};

	const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
		onDateRangeChange({
			...dateRange,
			[field]: value,
		});
	};

	const formatDateRange = (range: DateRange): string => {
		if (!range.startDate || !range.endDate) return 'Select date range';

		const start = new Date(range.startDate).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		});
		const end = new Date(range.endDate).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});

		return `${start} - ${end}`;
	};

	const isRangeActive = dateRange.startDate && dateRange.endDate;

	return (
		<div className="flex flex-wrap items-center gap-2">
			<Select
				value={isCustomRange ? 'custom' : '7days'}
				onValueChange={handlePresetChange}
			>
				<SelectTrigger className="w-[150px]">
					<SelectValue placeholder="Date Range" />
				</SelectTrigger>
				<SelectContent>
					{presetRanges.map((preset) => (
						<SelectItem key={preset.value} value={preset.value}>
							{preset.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{isCustomRange && (
				<>
					<div className="flex items-center gap-2">
						<Label htmlFor="start-date" className="sr-only">
							Start Date
						</Label>
						<Input
							id="start-date"
							type="date"
							value={dateRange.startDate}
							onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
							className="w-[140px]"
						/>
					</div>
					<div className="flex items-center gap-2">
						<Label htmlFor="end-date" className="sr-only">
							End Date
						</Label>
						<Input
							id="end-date"
							type="date"
							value={dateRange.endDate}
							onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
							className="w-[140px]"
						/>
					</div>
				</>
			)}

			{isRangeActive && (
				<Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
					<span className="text-xs">{formatDateRange(dateRange)}</span>
					<button
						onClick={onClear}
						className="ml-1 rounded-full hover:bg-muted"
						aria-label="Clear date range"
					>
						<FiX className="h-3 w-3" />
					</button>
				</Badge>
			)}
		</div>
	);
};

export default DateRangeFilter;
