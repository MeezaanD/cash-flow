import React, { useState } from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { FiX } from 'react-icons/fi';

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
		<Box className="date-range-filter">
			<Box className="date-range-controls">
				<FormControl size="small" sx={{ minWidth: 150 }}>
					<InputLabel>Date Range</InputLabel>
					<Select
						value={isCustomRange ? 'custom' : '7days'}
						label="Date Range"
						onChange={(e) => handlePresetChange(e.target.value as string)}
					>
						{presetRanges.map((preset) => (
							<MenuItem key={preset.value} value={preset.value}>
								{preset.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{isCustomRange && (
					<>
						<TextField
							label="Start Date"
							type="date"
							value={dateRange.startDate}
							onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
							size="small"
							InputLabelProps={{ shrink: true }}
							sx={{ minWidth: 140 }}
						/>
						<TextField
							label="End Date"
							type="date"
							value={dateRange.endDate}
							onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
							size="small"
							InputLabelProps={{ shrink: true }}
							sx={{ minWidth: 140 }}
						/>
					</>
				)}

				{isRangeActive && (
					<Chip
						label={formatDateRange(dateRange)}
						onDelete={onClear}
						deleteIcon={<FiX />}
						color="primary"
						variant="outlined"
						sx={{ maxWidth: 200 }}
					/>
				)}
			</Box>
		</Box>
	);
};

export default DateRangeFilter;
