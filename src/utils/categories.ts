import { Category, CategoryDefinition } from '../types';
import { DEFAULT_CATEGORY_TEMPLATES, TRANSFER_CATEGORY_VALUE } from '../constants/categories';
import { parseDbDateOrNull } from './date';

export const slugifyCategoryLabel = (label: string): string =>
	label
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '');

export const formatCategoryLabel = (value: string): string =>
	value
		.split('_')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');

type CategoryDoc = {
	id: string;
	value?: string;
	label?: string;
	createdAt?: unknown;
	updatedAt?: unknown;
};

export const normalizeCategoryDefinition = (doc: CategoryDoc): CategoryDefinition => {
	const category: CategoryDefinition = {
		id: doc.id,
		value: doc.value ?? doc.id,
		label: doc.label ?? formatCategoryLabel(doc.value ?? doc.id ?? ''),
	};

	const createdParsed = doc.createdAt != null ? parseDbDateOrNull(doc.createdAt) : null;
	if (createdParsed) {
		category.createdAt = createdParsed;
	}

	const updatedParsed = doc.updatedAt != null ? parseDbDateOrNull(doc.updatedAt) : null;
	if (updatedParsed) {
		category.updatedAt = updatedParsed;
	}

	return category;
};

export const toCategoryOption = (category: Pick<CategoryDefinition, 'value' | 'label'>): Category => ({
	value: category.value,
	label: category.label,
});

export const mergeCategoryOptions = (
	categories: Pick<CategoryDefinition, 'value' | 'label'>[],
	extraValues: string[] = []
): Category[] => {
	const merged = new Map<string, Category>();

	for (const category of categories) {
		if (category.value === TRANSFER_CATEGORY_VALUE) continue;
		merged.set(category.value, toCategoryOption(category));
	}

	for (const value of extraValues) {
		if (!value || value === TRANSFER_CATEGORY_VALUE || merged.has(value)) continue;
		merged.set(value, {
			value,
			label: formatCategoryLabel(value),
		});
	}

	return Array.from(merged.values()).sort((left, right) =>
		left.label.localeCompare(right.label)
	);
};

export const buildCategoryLabelMap = (
	categories: Pick<CategoryDefinition, 'value' | 'label'>[]
): Record<string, string> =>
	Object.fromEntries(
		categories
			.filter((category) => category.value !== TRANSFER_CATEGORY_VALUE)
			.map((category) => [category.value, category.label])
	);

export const getDefaultCategories = (): Array<Pick<CategoryDefinition, 'value' | 'label'>> =>
	DEFAULT_CATEGORY_TEMPLATES.map((category) => ({ ...category }));
