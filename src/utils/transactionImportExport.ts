import { ImportResult, SerializableTransaction, Transaction } from '../types';
import { parseDbDateOrNull } from './date';

const REQUIRED_FIELDS = ['title', 'amount', 'type', 'category'] as const;

const normalizeIsoDate = (value: unknown): string => {
	const parsed = parseDbDateOrNull(value);
	return parsed ? parsed.toISOString() : '';
};

const normalizeIsoDateOnly = (value: unknown): string => {
	const iso = normalizeIsoDate(value);
	return iso ? iso.slice(0, 10) : '';
};

export const buildTransactionSignature = (transaction: Transaction): string => {
	return `${transaction.title}|${transaction.amount}|${transaction.type}|${transaction.category}|${normalizeIsoDateOnly(transaction.date)}`;
};

const parseCsv = (text: string): SerializableTransaction[] => {
	const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
	if (!headerLine) return [];

	const headers = headerLine.split(',').map((h) => h.replace(/^"|"$/g, ''));
	const parseCSVValue = (cell: string) => cell.replace(/^"|"$/g, '').replace(/""/g, '"');

	return lines.map((line) => {
		const cells = line.match(/"(?:[^"]|"")*"|[^,]+/g) || [];
		const row: Record<string, string> = {};
		headers.forEach((h, i) => {
			row[h] = parseCSVValue(cells[i] ?? '');
		});
		return row as unknown as SerializableTransaction;
	});
};

const validateImportRow = (row: Record<string, unknown>, rowIndex: number): string[] => {
	const errors: string[] = [];
	const missing = REQUIRED_FIELDS.filter((key) => !(key in row) || row[key] === '');
	if (missing.length) {
		errors.push(`Row ${rowIndex}: Missing ${missing.join(', ')}`);
	}
	const amountNum = Number(row.amount);
	if (!isFinite(amountNum)) {
		errors.push(`Row ${rowIndex}: Invalid amount`);
	}
	if (row.type !== 'income' && row.type !== 'expense') {
		errors.push(`Row ${rowIndex}: Invalid type`);
	}
	return errors;
};

export const importTransactionsFromFile = async (
	file: File,
	existingTransactions: Transaction[],
	addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'createdAt'>) => Promise<void>
): Promise<ImportResult> => {
	const text = await file.text();
	let records: SerializableTransaction[] = [];

	if (file.name.toLowerCase().endsWith('.json')) {
		records = JSON.parse(text);
	} else if (file.name.toLowerCase().endsWith('.csv')) {
		records = parseCsv(text);
	} else {
		throw new Error('Unsupported file type. Use CSV or JSON.');
	}

	const existingSignatures = new Set(existingTransactions.map(buildTransactionSignature));
	let importedCount = 0;
	let skippedDuplicates = 0;
	const errors: string[] = [];

	for (const [index, record] of records.entries()) {
		const row =
			typeof record === 'object' && record
				? (record as unknown as Record<string, unknown>)
				: {};
		const rowNumber = index + 1;
		const rowErrors = validateImportRow(row, rowNumber);
		if (rowErrors.length) {
			errors.push(...rowErrors);
			continue;
		}

		const amountNum = Number(row.amount);
		const dateISO = row.date ? normalizeIsoDateOnly(row.date) : '';
		const signature = `${row.title}|${amountNum}|${row.type}|${row.category}|${dateISO}`;
		if (existingSignatures.has(signature)) {
			skippedDuplicates++;
			continue;
		}

		try {
			await addTransaction({
				title: String(row.title),
				amount: amountNum,
				type: row.type as 'income' | 'expense',
				category: String(row.category),
				description: row.description ? String(row.description) : '',
			});
			importedCount++;
			existingSignatures.add(signature);
		} catch {
			errors.push(`Row ${rowNumber}: Failed to save`);
		}
	}

	return { importedCount, skippedDuplicates, errors };
};

export const exportTransactionsToCsv = (transactions: Transaction[]): string => {
	const headers = ['title', 'amount', 'type', 'category', 'description', 'date', 'createdAt', 'id'];
	const safe = (value: unknown) => {
		if (value == null) return '';
		const str = String(value).replace(/"/g, '""');
		return `"${str}"`;
	};

	const rows = transactions.map((t) => {
		const date = normalizeIsoDate(t.date);
		const createdAt = normalizeIsoDate(t.createdAt);
		return [
			t.title,
			t.amount,
			t.type,
			t.category,
			t.description ?? '',
			date,
			createdAt,
			t.id ?? '',
		]
			.map(safe)
			.join(',');
	});

	return [headers.join(','), ...rows].join('\n');
};

export const exportTransactionsToJson = (transactions: Transaction[]): string => {
	return JSON.stringify(transactions, null, 2);
};
