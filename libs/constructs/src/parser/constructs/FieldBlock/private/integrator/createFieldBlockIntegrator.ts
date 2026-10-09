import type { FieldBlock } from '../../../../../factories/index.js';
import type { ConstructIntegrator } from '../../../../types.js';
import { onBeforeConstruct } from '../helpers/onBeforeConstruct.js';

export function createFieldBlockIntegrator(): ConstructIntegrator {
	return {
		integrate(context, _node, construct) {
			const field = construct as FieldBlock;
			context.captureChildConstruct(field);
			return context.childContext(field, onBeforeConstruct);
		},
	};
}
