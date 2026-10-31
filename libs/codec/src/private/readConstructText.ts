import type { ConstructBase } from '@art-md/primitives';

export function readConstructText(construct: ConstructBase): string {
	if ('value' in construct && typeof construct.value === 'string') {
		return construct.value;
	}
	if ('children' in construct && Array.isArray(construct.children)) {
		return construct.children.map(child => readConstructText(child as ConstructBase)).join('');
	}
	return '';
}
